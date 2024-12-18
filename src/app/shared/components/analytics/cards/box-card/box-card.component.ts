import { NgClass, NgStyle } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { CardModule } from "primeng/card";
import { SkeletonModule } from "primeng/skeleton";
import { ParseNumberOnlyPipe } from "../../../../pipes/parse-number-only.pipe";
@Component({
  selector: "app-box-card",
  standalone: true,
  imports: [CardModule, ParseNumberOnlyPipe, SkeletonModule, NgStyle, NgClass],
  templateUrl: "./box-card.component.html",
  styleUrl: "./box-card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxCardComponent {
  title = input.required<string>();
  type = input.required<"normal" | "withoutIcon">();
  currency = input<string>("");
  isLoading = input<boolean>(false);
  total = input<number>(0);
  cost = input<number>(0);
  rate = input<string>("");
}
