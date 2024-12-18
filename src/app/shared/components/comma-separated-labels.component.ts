import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-comma-separated-labels",
  standalone: true,
  imports: [TooltipModule],
  template: `
    @if (items().length) {
      <div pTooltip="{{ tooltipText() }}" tooltipPosition="top" [class]="styleClass()">
        @for (item of slicedItems(); track $index; let last = $last) {
          <span>
            {{ item.label }}
            @if (!last) {
              <span>,</span>
            }
          </span>
        }
        @if (items().length > sliceCount()) {
          <span>...</span>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommaSeparatedLabelsComponent {
  items = input.required<{ id: number; label: string }[]>();
  styleClass = input("font-medium text-xs");
  sliceCount = input(2);
  tooltip = input("");
  slicedItems = computed(() => this.items().slice(0, this.sliceCount()));
  tooltipText = computed(
    () =>
      this.tooltip() +
      ": " +
      this.items()
        .map(item => item.label)
        .join(", "),
  );
}
