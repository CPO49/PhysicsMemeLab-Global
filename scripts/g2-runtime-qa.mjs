import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'

const url = 'http://127.0.0.1:5173/'
const outputDirectory = 'test-results/screenshots/milestone-g2'
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const port = 9237
const sizes = [
  [1366, 768],
  [1600, 900],
  [1920, 1080],
]

await mkdir(outputDirectory, { recursive: true })
const browser = spawn(edge, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--no-first-run',
  '--disable-gpu',
  `--user-data-dir=C:/tmp/g2-reference-qa-${Date.now()}`,
  url,
], { stdio: 'ignore', detached: true })

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
let target
for (let attempt = 0; attempt < 30; attempt += 1) {
  try {
    const pages = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())
    target = pages.find((page) => page.type === 'page')
    if (target) break
  } catch {
    await pause(250)
  }
}
if (!target) throw new Error('DevTools target was not available')

const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

let sequence = 0
const pending = new Map()
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data)
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) reject(new Error(message.error.message))
    else resolve(message.result)
  }
})
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence
  pending.set(id, { resolve, reject })
  socket.send(JSON.stringify({ id, method, params }))
})
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result.value
}
const capture = async (name, width, height) => {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
  await pause(300)
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  await writeFile(`${outputDirectory}/${name}`, Buffer.from(data, 'base64'))
  return evaluate(`JSON.stringify({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, viewport: [innerWidth, innerHeight], labels: [...document.querySelectorAll('button,a')].map((node) => node.textContent.trim()).filter(Boolean) })`)
}

await send('Page.enable')
await send('Runtime.enable')
await pause(900)
const report = { landing: {}, map: {}, assetStatus: [], visualDebug: false }
for (const [width, height] of sizes) {
  report.landing[`${width}x${height}`] = JSON.parse(await capture(`${width}x${height}-landing.png`, width, height))
}
await evaluate(`document.querySelector('.reference-primary-action')?.click()`)
await pause(350)
for (const [width, height] of sizes) {
  report.map[`${width}x${height}`] = JSON.parse(await capture(`${width}x${height}-map.png`, width, height))
}
report.assetStatus = await evaluate(`Promise.all([...document.images].map(async (image) => ({ path: image.getAttribute('data-asset-path') ?? image.getAttribute('src'), complete: image.complete, width: image.naturalWidth })))`)
await evaluate(`location.href='${url}?visualDebug=1'`)
await pause(750)
report.visualDebug = await evaluate(`document.body.textContent.includes('Visual Debug') || document.querySelector('[class*="debug"]') !== null`)
await writeFile(`${outputDirectory}/comparison-notes.json`, JSON.stringify(report, null, 2))
socket.close()
browser.kill()
console.log(JSON.stringify(report, null, 2))
