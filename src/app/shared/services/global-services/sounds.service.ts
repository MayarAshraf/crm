import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {

  playSound(soundType: string) {
    const soundMap: { [key: string]: string } = {
      "offline": "/assets/media/audio/offline-sound.mp3",
      "online": "/assets/media/audio/online-sound.mp3",
      "notification": "/assets/media/audio/notification-sound.mp3",
      "error": "/assets/media/audio/error-sound.mp3",
      "default": "/assets/media/audio/default-sound.mp3"
    };

    const audio = new Audio();
    audio.src = soundMap[soundType];
    audio.load();
    audio.play();
  };
}
