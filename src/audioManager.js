import { set } from "firebase/database";

// src/audioManager.js
class AudioManager {
  constructor() {
    this.backgroundMusic = new Audio('./src/assets/background-music.mp3');
    this.buttonClickSound = new Audio('./src/assets/button-click.mp3');
    this.gameStartSound = new Audio('./src/assets/game-start.mp3');
    this.failSound = new Audio('./src/assets/fail.mp3');
    this.musicStarted = false;
    this.soundEnabled = false;
  }

  enableSound() {
    this.soundEnabled = true;
    this.playBackgroundMusic();
  }

  disableSound() {
    this.soundEnabled = false;
    this.stopBackgroundMusic();
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (this.soundEnabled) {
      this.playBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
  }

  playBackgroundMusic() {
    if (this.soundEnabled && !this.musicStarted) {
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.05;
      this.backgroundMusic.play().catch((error) => {
        console.log('Background music play failed:', error);
      });
      this.musicStarted = true;
    }
  }

  stopBackgroundMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
    this.musicStarted = false;
  }

  playButtonClick() {
    if (this.soundEnabled) {
      this.buttonClickSound.volume = 1;
      this.buttonClickSound.play();
    }
  }

  playGameStart() {
    
    if (this.soundEnabled) {
        this.backgroundMusic.pause();
      this.gameStartSound.volume = 0.06;
      this.gameStartSound.play();
  

      setTimeout(() => {
        this.backgroundMusic.play();
      }, 10000);
    }
  }

  playFail() {
    if (this.soundEnabled) {
      this.backgroundMusic.pause();
      this.failSound.volume = 0.06;
      this.failSound.play();
      setTimeout(() => {
        this.backgroundMusic.play();
      }, 3000);
    }
  }






}

export default new AudioManager();
