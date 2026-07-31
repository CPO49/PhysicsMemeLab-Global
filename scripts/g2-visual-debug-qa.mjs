import { spawn } from 'node:child_process'

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const port = 9238
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
const browser = spawn(edge, ['--headless=new', `--remote-debugging-port=${port}`, '--no-first-run', '--disable-gpu', `--user-data-dir=C:/tmp/g2-debug-qa-${Date.now()}`, 'http://127.0.0.1:5173/?visualDebug=1'], { stdio: 'ignore', detached: true })
let target
for (let attempt = 0; attempt < 30; attempt += 1) { try { target = (await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())).find((page) => page.type === 'page'); if (target) break } catch { await pause(250) } }
if (!target) throw new Error('DevTools target was not available')
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
let sequence = 0
const pending = new Map()
socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (message.id && pending.has(message.id)) { const request = pending.get(message.id); pending.delete(message.id); message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result) } })
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })) })
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value
await pause(800)
await evaluate(`document.querySelector('.reference-primary-action')?.click()`)
await pause(250)
await evaluate(`document.querySelector('.world-map-island--active')?.click()`)
await pause(250)
await evaluate(`document.querySelector('a.button')?.click()`)
await pause(300)
const report = await evaluate(`JSON.stringify({ panel: Boolean(document.querySelector('.visual-debug-panel')), mission: Boolean(document.querySelector('.mission-flow')), normalLandingControlsHidden: !document.querySelector('.reference-landing') })`)
console.log(report)
socket.close()
browser.kill()
