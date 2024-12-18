import { CurrencyPipe, NgStyle } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { MeterGroupModule, MeterItem } from "primeng/metergroup";
import { ProgressBarModule } from "primeng/progressbar";

@Component({
  selector: "app-campaign-profile-progress-info",
  standalone: true,
  imports: [MeterGroupModule, ProgressBarModule, CurrencyPipe, NgStyle],
  templateUrl: "./campaign-profile-progress-info.component.html",
  styleUrl: "./campaign-profile-progress-info.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignProfileProgressInfoComponent {
  title = input.required<string>();
  expected = input.required<string>();
  campaignCurrency = input<string>();
  actual = input<number>();
  actualPercentage = input<number>();
  actualGroup = input<{ currency: string; formatted: string }[]>(
    [] as { currency: string; formatted: string }[],
  );
  expectedTotal = input<number>();
  colorProgress = input<string>();
  type = input<"meterGroup" | "progress">("progress");

  meterGroup = computed<MeterItem[]>(() => {
    if (this.type() === "meterGroup") {
      return this.actualGroup().length
        ? this.actualGroup().map((item, i) => {
            return {
              label: item.currency,
              value: parseInt(item.formatted.replace(/[^\d]/g, ""), 10),
              icon: "pi-money-bill",
            };
          })
        : [
            {
              label: this.campaignCurrency(),
              value: 0,
              icon: "pi-money-bill",
            },
          ];
    }
    return [] as MeterItem[];
  });
}
