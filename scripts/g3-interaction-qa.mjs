import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const port = 9241
const root = 'http://127.0.0.1:5173/'
const out = 'test-results/screenshots/milestone-g3'
const sizes = [[1366, 768], [1600, 900], [1920, 1080]]
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
await mkdir(out, { recursive: true })
const browser = spawn(edge, ['--headless=new', `--remote-debugging-port=${port}`, '--no-first-run', '--disable-gpu', `--user-data-dir=C:/tmp/g3-qa-${Date.now()}`, root], { detached: true, stdio: 'ignore' })
let target
for (let attempt = 0; attempt < 30; attempt += 1) { try { target = (await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json())).find((page) => page.type === 'page'); if (target) break } catch { await pause(250) } }
if (!target) throw new Error('DevTools target unavailable')
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
let id = 0
const pending = new Map()
socket.addEventListener('message', ({ data }) => { const message = JSON.parse(data); if (message.id && pending.has(message.id)) { const request = pending.get(message.id); pending.delete(message.id); message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result) } })
const send = (method, params = {}) => new Promise((resolve, reject) => { const requestId = ++id; pending.set(requestId, { resolve, reject }); socket.send(JSON.stringify({ id: requestId, method, params })) })
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value
const click = async (selector) => { await evaluate(`document.querySelector(${JSON.stringify(selector)})?.click(); true`); await pause(150) }
const shot = async (name, width, height) => { await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }); await pause(260); const { data } = await send('Page.captureScreenshot', { format: 'png' }); await writeFile(`${out}/${name}`, Buffer.from(data, 'base64')); return JSON.parse(await evaluate('JSON.stringify({scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,innerWidth,innerHeight})')) }
await send('Runtime.enable')
await send('Page.navigate', { url: root })
await pause(900)
const report = { initial: await evaluate('JSON.stringify({g3:Boolean(document.querySelector(\'.g3-landing\')), text:document.body.innerText.slice(0,300)})'), landing: {}, map: {}, interactions: {}, assets: {} }
for (const [width, height] of sizes) report.landing[`${width}x${height}`] = await shot(`${width}x${height}-landing.png`, width, height)
await click('.g3-input-selector button:nth-child(1)')
report.interactions.cameraSelected = await evaluate(`document.querySelector('.g3-input-selector button:nth-child(1)')?.getAttribute('aria-pressed') === 'true' && document.body.textContent.includes('พร้อมเชื่อมต่อกล้องในขั้นถัดไป')`)
await click('.g3-input-selector button:nth-child(3)')
report.interactions.mouseSelected = await evaluate(`document.querySelector('.g3-input-selector button:nth-child(3)')?.getAttribute('aria-pressed') === 'true'`)
await click('.g3-landing-actions__primary')
await pause(250)
for (const [width, height] of sizes) report.map[`${width}x${height}`] = await shot(`${width}x${height}-world-map.png`, width, height)
await click('.g3-map-hud__profile button')
report.interactions.profileOpens = await evaluate(`Boolean(document.querySelector('.g3-map-hud__dropdown'))`)
await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`)
report.interactions.profileClosesEscape = await evaluate(`!document.querySelector('.g3-map-hud__dropdown')`)
for (const [index, name] of ['missions','statistics','collection','settings'].entries()) { await click(`.g3-map-menu button:nth-child(${index + 1})`); report.interactions[name] = await evaluate(`Boolean(document.querySelector('.g3-map-modal'))`); await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`) }
await click('.g3-island--locked')
report.interactions.lockedModal = await evaluate(`document.body.textContent.includes('เงื่อนไขปลดล็อก')`)
await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`)
await click('.g3-island--coming-soon')
report.interactions.comingSoonModal = await evaluate(`document.body.textContent.includes('กำลังจะมาเร็ว ๆ นี้')`)
await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`)
await click('.g3-island--active')
report.interactions.projectileHub = await evaluate(`document.body.textContent.includes('ยิงข้ามกำแพงให้โดนเป้าหมาย')`)
await evaluate(`location.href=${JSON.stringify(root)}`); await pause(700)
await click('.g3-landing-actions__secondary')
await pause(250)
report.interactions.quickDemo = await evaluate(`document.body.textContent.includes('Demo mode: ON')`)
const assetEntries = Object.values({ hud: ['/assets/generated/hud/hud-energy-frame.svg','/assets/generated/hud/hud-diamond-frame.svg','/assets/generated/hud/hud-profile-frame.svg','/assets/generated/hud/profile-avatar-frame.svg'], menu: ['/assets/generated/menu/menu-button-default.svg','/assets/generated/menu/menu-button-active.svg','/assets/generated/menu/icon-mission.svg','/assets/generated/menu/icon-statistics.svg','/assets/generated/menu/icon-collection.svg','/assets/generated/menu/icon-settings.svg'], landing: ['/assets/generated/landing/landing-primary-button-frame.svg','/assets/generated/landing/landing-secondary-button-frame.svg','/assets/generated/landing/landing-control-card-frame.svg','/assets/generated/landing/icon-camera.svg','/assets/generated/landing/icon-hand.svg','/assets/generated/landing/icon-mouse.svg','/assets/generated/landing/icon-play.svg'], map: ['/assets/generated/map/island-label-frame.svg','/assets/generated/map/island-progress-frame.svg','/assets/generated/map/lock-large.svg','/assets/generated/map/badge-new.svg','/assets/generated/map/badge-coming-soon.svg','/assets/generated/map/sticky-note-you-got-this.svg'] }).flat()
report.assets.status = await Promise.all(assetEntries.map(async (path) => [path, (await fetch(`${root.slice(0,-1)}${path}`)).status]))
const contactMarkup = assetEntries.map((path) => `<figure><img src="${root.slice(0,-1)}${path}"><figcaption>${path.split('/').pop()}</figcaption></figure>`).join('')
await evaluate(`document.documentElement.innerHTML='<style>body{margin:0;padding:24px;background:#12385b;color:#fff8e8;font:700 17px system-ui}main{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}figure{margin:0;padding:14px;background:#2477d4;border:3px solid #ffc928;border-radius:14px}img{width:100%;height:90px;object-fit:contain}figcaption{margin-top:8px;overflow-wrap:anywhere}</style><main>${contactMarkup.replace(/'/g, "\\'")}</main>'`)
await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false }); await pause(250)
const contact = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); await writeFile(`${out}/generated-assets-contact-sheet.png`, Buffer.from(contact.data, 'base64'))
await writeFile(`${out}/interaction-report.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
socket.close(); browser.kill()
