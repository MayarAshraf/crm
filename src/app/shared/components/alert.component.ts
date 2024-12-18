import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

@Component({
  selector: "app-alert",
  standalone: true,
  imports: [NgClass],
  template: `
    <div
      class="alert"
      [ngClass]="{
        'alert-success': type() === 'success',
        'alert-error': type() === 'error',
        'alert-info': type() === 'info',
        'alert-warn': type() === 'warn'
      }"
    >
      <i [ngClass]="icon()"></i>
      <span class="alert-message">{{ message() }}</span>
    </div>
  `,
  styles: `
    .alert {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
      font-size: 14px;
      font-weight: 500;
    }

    .alert-success {
      color: #fff;
      background-color: #1dc9b7;
    }

    .alert-error {
      color: #fff;
      background-color: #fd387a;
    }

    .alert-info {
      color: #2c3e7a;
      background-color: #dde4fb;
    }

    .alert-warn {
      color: #242424;
      background-color: #ffb822;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  type = input<"success" | "error" | "warn" | "info">("info");
  message = input<string>("");
  icon = computed(() => {
    switch (this.type()) {
      case "success":
        return "pi pi-check";
      case "error":
        return "pi pi-times-circle";
      case "warn":
        return "pi pi-exclamation-triangle";
      case "info":
        return "pi pi-info-circle";
    }
  });
}
