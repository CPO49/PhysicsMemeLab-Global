import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const port = 9245
const root = 'http://127.0.0.1:5173'
const out = 'test-results/screenshots/milestone-g5'
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
await mkdir(out, { recursive: true })
const browser = spawn(edge, ['--headless=new', `--remote-debugging-port=${port}`, '--no-first-run', '--disable-gpu', `--user-data-dir=C:/tmp/g5-qa-${Date.now()}`, `${root}/layout-editor`], { detached: true, stdio: 'ignore' })
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
const errors = []
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data)
  if (message.id && pending.has(message.id)) {
    const request = pending.get(message.id)
    pending.delete(message.id)
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result)
  }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text)
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') errors.push(message.params.entry.text)
})
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const requestId = ++id
  pending.set(requestId, { resolve, reject })
  socket.send(JSON.stringify({ id: requestId, method, params }))
})
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value
await send('Runtime.enable')
await send('Log.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false })
await pause(800)
const report = {
  editorVisible: await evaluate(`Boolean(document.querySelector('.layout-studio'))`),
  sharedRendererVisible: await evaluate(`Boolean(document.querySelector('.landing-renderer--editor'))`),
  layers: await evaluate(`document.querySelectorAll('.layout-studio__layers button').length`),
  dragChangedPosition: false,
  textAppliedToLiveLanding: false,
  storageVersion: null,
  returnedToLanding: false,
  fullViewportAfterApply: false,
  errors,
}
const beforeX = await evaluate(`document.querySelector('[data-layout-id="headline"]').getBoundingClientRect().x`)
const point = JSON.parse(await evaluate(`JSON.stringify((() => { const r=document.querySelector('[data-layout-id="headline"]').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2} })())`))
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: point.x, y: point.y, button: 'left', clickCount: 1 })
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: point.x + 42, y: point.y + 18, button: 'left' })
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: point.x + 42, y: point.y + 18, button: 'left', clickCount: 1 })
await pause(150)
report.dragChangedPosition = (await evaluate(`document.querySelector('[data-layout-id="headline"]').getBoundingClientRect().x`)) > beforeX + 20
await evaluate(`(() => { const input=document.querySelector('.layout-studio__properties textarea'); const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set; setter.call(input,'Studio test headline'); input.dispatchEvent(new Event('input',{bubbles:true})); })()`)
await pause(100)
await evaluate(`document.querySelector('.layout-studio__apply').click()`)
await pause(350)
report.returnedToLanding = await evaluate(`Boolean(document.querySelector('.landing-renderer:not(.landing-renderer--editor)')) && location.pathname === '/'`)
report.textAppliedToLiveLanding = await evaluate(`document.querySelector('.g4-landing-headline')?.textContent === 'Studio test headline'`)
report.storageVersion = await evaluate(`JSON.parse(localStorage.getItem('memePhysics.landingLayout.v1')).version`)
report.fullViewportAfterApply = await evaluate(`(() => { const r=document.querySelector('.g3-landing').getBoundingClientRect(); return r.x===0 && r.y===0 && r.width===innerWidth && r.height===innerHeight && document.documentElement.scrollWidth===innerWidth })()`)
const { data } = await send('Page.captureScreenshot', { format: 'png' })
await writeFile(`${out}/layout-applied-to-landing.png`, Buffer.from(data, 'base64'))
await evaluate(`localStorage.removeItem('memePhysics.landingLayout.v1')`)
await writeFile(`${out}/runtime-report.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
socket.close()
browser.kill()
