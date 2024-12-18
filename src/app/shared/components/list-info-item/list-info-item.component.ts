import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-list-info-item",
  standalone: true,
  template: `
    <span class="item-label"> {{ label() }}</span>
    @if (item()) {
      <h6 class="text-sm text-700 font-semibold m-0">{{ item() }}</h6>
    }
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListInfoComponent {
  label = input<string>();
  item = input<any>();
}
