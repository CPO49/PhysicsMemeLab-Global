import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const port = 9244
const root = 'http://127.0.0.1:5173/'
const out = 'test-results/screenshots/milestone-g42'
const sizes = [[1366, 768], [1920, 1080]]
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
await mkdir(out, { recursive: true })
const browser = spawn(edge, ['--headless=new', `--remote-debugging-port=${port}`, '--no-first-run', '--disable-gpu', `--user-data-dir=C:/tmp/g42-qa-${Date.now()}`, root], { detached: true, stdio: 'ignore' })
let target
for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    target = (await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())).find((page) => page.type === 'page')
    if (target) break
  } catch { await pause(250) }
}
if (!target) throw new Error('DevTools target unavailable')
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})
let id = 0
const pending = new Map()
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data)
  if (message.id && pending.has(message.id)) {
    const request = pending.get(message.id)
    pending.delete(message.id)
    message.error ? request.reject(new Error(request.method + ': ' + message.error.message)) : request.resolve(message.result)
  }
})
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const requestId = ++id
  pending.set(requestId, { resolve, reject, method })
  socket.send(JSON.stringify({ id: requestId, method, params }))
})
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value
const report = { viewports: {}, navigationWorks: false, errors: [] }
await send('Runtime.enable')
await send('Log.enable')
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data)
  if (message.method === 'Runtime.exceptionThrown') report.errors.push(message.params.exceptionDetails.text)
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') report.errors.push(message.params.entry.text)
})
for (const [width, height] of sizes) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url: root })
  await pause(1400)
  const key = `${width}x${height}`
  report.viewports[key] = JSON.parse(await evaluate(`JSON.stringify((() => {
    const root = document.querySelector('.g3-landing')
    const background = document.querySelector('.g3-landing__background')
    const rect = root?.getBoundingClientRect()
    return {
      innerWidth,
      innerHeight,
      root: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
      background: background ? { width: background.getBoundingClientRect().width, height: background.getBoundingClientRect().height, fit: getComputedStyle(background).objectFit } : null,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      verticalOverflow: document.documentElement.scrollHeight > innerHeight,
      logoVisible: Boolean(document.querySelector('.g3-landing__logo')?.getBoundingClientRect().width),
      startVisible: Boolean(document.querySelector('.g3-landing-actions__primary')?.getBoundingClientRect().width)
    }
  })())`))
  const { data } = await send('Page.captureScreenshot', { format: 'png' })
  await writeFile(`${out}/${key}-landing.png`, Buffer.from(data, 'base64'))
}
await evaluate(`document.querySelector('.g3-landing-actions__primary')?.click()`)
await pause(250)
report.navigationWorks = await evaluate(`Boolean(document.querySelector('.g3-map') || document.querySelector('.map-page') || document.querySelector('.g3-world-map'))`)
await writeFile(`${out}/runtime-report.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
socket.close()
browser.kill()
