type SoundType = "move" | "capture" | "check" | "checkmate" | "illegal" | "gameStart" | "gameEnd" | "notify";

class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private enabled = true;
  private volume = 0.5;

  constructor() {
    // Initialize sound files
    const soundFiles: Record<SoundType, string> = {
      move: "/sounds/move.mp3",
      capture: "/sounds/capture.mp3",
      check: "/sounds/check.mp3",
      checkmate: "/sounds/checkmate.mp3",
      illegal: "/sounds/illegal.mp3",
      gameStart: "/sounds/game-start.mp3",
      gameEnd: "/sounds/game-end.mp3",
      notify: "/sounds/notify.mp3",
    };

    Object.entries(soundFiles).forEach(([type, path]) => {
      const audio = new Audio(path);
      audio.volume = this.volume;
      this.sounds.set(type as SoundType, audio);
    });
  }

  play(type: SoundType) {
    if (!this.enabled) return;

    const sound = this.sounds.get(type);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((error) => {
        console.warn(`Failed to play ${type} sound:`, error);
      });
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach((sound) => {
      sound.volume = this.volume;
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  getVolume() {
    return this.volume;
  }
}

export const soundManager = new SoundManager();
