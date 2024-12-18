import { Clipboard } from "@angular/cdk/clipboard";
import { ChangeDetectionStrategy, Component, inject, input, signal } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-copy-button",
  standalone: true,
  imports: [ButtonModule, TooltipModule, TranslateModule],
  template: `
    <div class="copy-holder">
      <p-button
        #copyButton
        [text]="true"
        severity="info"
        icon="fas fa-copy"
        [pTooltip]="'copy' | translate"
        tooltipPosition="top"
        [positionTop]="-10"
        (click)="copyText(text())"
        styleClass="p-button-rounded copy-button text-primary text-xs w-2rem h-2rem p-1 transition-none shadow-none"
      ></p-button>
      @if (copied()) {
        <span class="custom-tooltip">{{ "copied" | translate }}</span>
      }
    </div>
  `,
  styles: `
    .copy-holder {
      position: relative;
      z-index: 5;
      .custom-tooltip {
        position: absolute;
        top: -100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #4b5563;
        color: #fff;
        padding: 3px 10px;
        border-radius: 6px;
        font-size: 12px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        pointer-events: none;
        &::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -6px;
          border-width: 6px;
          border-style: solid;
          border-color: #4b5563 transparent transparent transparent;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyButtonComponent {
  #clipboard = inject(Clipboard);

  text = input("");
  copied = signal(false);

  copyText(text: string) {
    this.#clipboard.copy(text);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
