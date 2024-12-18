import { ChangeDetectionStrategy, Component, computed, input, signal } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-mask-toggler",
  standalone: true,
  imports: [ButtonModule, TooltipModule],
  template: `
    <div class="flex align-items-center gap-1">
      <span class="text-sm font-semibold"> {{ isVisible() ? data() : maskedData() }}</span>
      <button
        pButton
        [pTooltip]="isVisible() ? 'Hide' : 'Show'"
        tooltipPosition="top"
        class="p-button-link w-auto p-0 shadow-none text-primary"
        icon="{{ 'text-xs ' + (isVisible() ? 'fas fa-eye-slash' : 'fas fa-eye') }}"
        (click)="toggleVisibility()"
      ></button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaskTogglerComponent {
  data = input<string>("");
  isVisible = signal(false);

  maskedData = computed(() => {
    const visibleLength = Math.ceil(this.data().length / 4);
    const maskedPart = this.data().slice(0, -visibleLength).replace(/./g, "*");
    const visiblePart = this.data().slice(-visibleLength);
    return maskedPart + visiblePart;
  });

  toggleVisibility(): void {
    this.isVisible.set(!this.isVisible());
  }
}
