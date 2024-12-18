import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AnimationOptions, LottieComponent } from "ngx-lottie";
import { ConfettiService } from "../services";

@Component({
  selector: "app-confetti",
  template: `
    @if (showConfetti()) {
      <div class="confetti-holder">
        <ng-lottie [options]="options" width="275px"> </ng-lottie>
      </div>
    }
  `,
  styles: `
    .confetti-holder {
      position: fixed;
      z-index: var(--high-index);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
  `,
  standalone: true,
  imports: [LottieComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfettiComponent {
  showConfetti = inject(ConfettiService).showConfetti;

  randomConfettiNumber = Math.floor(Math.random() * 8) + 1;
  options: AnimationOptions = {
    path: `assets/lottie/confetti-${this.randomConfettiNumber}.json`,
  };
}
