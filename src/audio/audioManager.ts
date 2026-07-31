import { audioScenePaths, type AudioScene, type SoundEffect } from './audioManifest'

export type AudioSettings = { enabled: boolean; masterVolume: number; musicVolume: number; sfxVolume: number }
const storageKey = 'memePhysics.audioSettings.v1'
const defaults: AudioSettings = { enabled: true, masterVolume: .75, musicVolume: .45, sfxVolume: .42 }

function loadSettings(): AudioSettings {
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return defaults
    const value = JSON.parse(raw) as Partial<AudioSettings>
    return { ...defaults, ...value }
  } catch { return defaults }
}

class AudioManager {
  private settings = typeof window === 'undefined' ? defaults : loadSettings()
  private unlocked = false
  private scene: AudioScene | null = null
  private music: HTMLAudioElement | null = null
  private context: AudioContext | null = null

  unlock = () => {
    this.unlocked = true
    if (this.context?.state === 'suspended') void this.context.resume()
    if (this.scene) this.playScene(this.scene)
  }

  getSettings = () => this.settings

  updateSettings = (patch: Partial<AudioSettings>) => {
    this.settings = { ...this.settings, ...patch }
    try { window.localStorage.setItem(storageKey, JSON.stringify(this.settings)) } catch { /* local storage is optional */ }
    if (this.music) this.music.muted = !this.settings.enabled
    if (this.settings.enabled && this.unlocked && this.scene) this.playScene(this.scene)
  }

  setScene = (scene: AudioScene) => {
    if (this.scene === scene) return
    this.scene = scene
    if (this.unlocked && this.settings.enabled) this.playScene(scene)
  }

  private playScene = (scene: AudioScene) => {
    const path = audioScenePaths[scene]
    if (this.music?.src.endsWith(path)) return
    const previous = this.music
    const next = new Audio(path)
    next.loop = scene !== 'summary'
    next.volume = this.settings.masterVolume * this.settings.musicVolume
    next.muted = !this.settings.enabled
    next.preload = 'metadata'
    this.music = next
    void next.play().catch(() => undefined)
    if (previous) { previous.pause(); previous.currentTime = 0 }
  }

  play = (effect: SoundEffect) => {
    if (!this.unlocked || !this.settings.enabled) return
    const frequencies: Record<SoundEffect, number> = { hover: 640, click: 520, missionStart: 740, locked: 160, charge: 420, skillUnlocked: 880, launch: 310, hit: 980, miss: 220, success: 1040 }
    try {
      this.context ??= new AudioContext()
      const oscillator = this.context.createOscillator()
      const gain = this.context.createGain()
      oscillator.type = effect === 'locked' || effect === 'miss' ? 'triangle' : 'sine'
      oscillator.frequency.setValueAtTime(frequencies[effect], this.context.currentTime)
      gain.gain.setValueAtTime(.0001, this.context.currentTime)
      gain.gain.exponentialRampToValueAtTime(Math.max(.0001, this.settings.masterVolume * this.settings.sfxVolume * .12), this.context.currentTime + .01)
      gain.gain.exponentialRampToValueAtTime(.0001, this.context.currentTime + .12)
      oscillator.connect(gain).connect(this.context.destination)
      oscillator.start()
      oscillator.stop(this.context.currentTime + .13)
    } catch { /* sound never blocks interaction */ }
  }
}

export const audioManager = new AudioManager()
