import { th } from '../../content/th'
import { gameUiAssets } from '../gameUiAssets'
export const landingCards = [
  { id: 'camera', icon: gameUiAssets.landing.camera, title: th.g3.inputCamera, body: 'The game can detect hand gestures with your camera. It asks for permission when you start a camera-enabled mission. Frames are processed locally and are not recorded or uploaded.', hint: 'Move to aim' },
  { id: 'gesture', icon: gameUiAssets.landing.hand, title: th.g3.inputGesture, body: 'Move your hands to charge energy, aim, and activate physics-related skills.', hint: 'Grab and release' },
  { id: 'mouse', icon: gameUiAssets.landing.mouse, title: 'Mouse & keys', body: 'You can use mouse and keyboard controls without enabling the camera.', hint: 'No camera' },
] as const
export type LandingInfoId = typeof landingCards[number]['id']
export const landingInfo = Object.fromEntries(landingCards.map(({ id, title, body }) => [id, { title, body }])) as Record<LandingInfoId, { title: string; body: string }>
