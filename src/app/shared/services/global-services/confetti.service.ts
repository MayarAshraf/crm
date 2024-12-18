import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class ConfettiService {
  #showConfetti = signal<boolean>(false); // private to this service.
  showConfetti = this.#showConfetti.asReadonly(); // exposed publicly.

  CONFETTI_TIME_PERIOD = 5000;

  playConfetti() {
    this.#showConfetti.set(true);
    setTimeout(() => this.#showConfetti.set(false), this.CONFETTI_TIME_PERIOD);
  };
}
