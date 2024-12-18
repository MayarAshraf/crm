import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: "app-custom-layout-skeleton",
  standalone: true,
  imports: [SkeletonModule],
  template: `
    @if (isListLayout()) {
      <div class="flex gap-3 align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">
          @if (isSelection()) {
            <p-skeleton width="17px" height="17px" borderRadius="3px" />
          }
          <p-skeleton width="100px" height="12px" />
          <p-skeleton width="220px" height="25px" borderRadius="4px" />
        </div>

        <div class="flex gap-3">
          <div class="flex gap-1">
            <p-skeleton shape="circle" size="2rem" />
            <p-skeleton shape="circle" size="2rem" />
            <p-skeleton shape="circle" size="2rem" />
            <p-skeleton shape="circle" size="2rem" />
          </div>
          <p-skeleton width="150px" height="32px" borderRadius="30px" />
        </div>
      </div>
    } @else {
      <p-skeleton height="200px" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomLayoutSkeletonComponent {
  isListLayout = input(false);
  isSelection = input(false);
}
