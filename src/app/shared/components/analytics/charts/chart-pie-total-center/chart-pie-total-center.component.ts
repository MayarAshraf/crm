import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { LangService } from "@gService/lang.service";
import { Chart } from "chart.js";
import { ChartModule } from "primeng/chart";
import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: "app-chart-pie-total-center",
  standalone: true,
  imports: [ChartModule, SkeletonModule],
  template: `
    @if (!isLoading()) {
      <div class="mt-3">
        <p-chart type="doughnut" [data]="dataChart()" [options]="options()" [width]="width()">
        </p-chart>
      </div>
    } @else {
      <div class="p-4">
        <p-skeleton shape="circle" size="8rem" />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPieTotalCenterComponent {
  currentLang = inject(LangService).currentLanguage;
  data = input.required<number[]>();
  labels = input.required<string[]>();
  backgroundColors = input<string[]>([]);

  cutout = input<string>("70%");
  width = input<string>("300px");
  isLoading = input<boolean>(true);

  dataChart = computed(() => this.initDisplayChart());
  options = computed(() => this.initDisplayOptions());

  ngOnInit() {
    Chart.register(this.registerCenterTextPlugin());
  }

  initDisplayChart() {
    if (!this.labels().length && !this.data().length) return;
    const labels = this.labels().map((label: string, index: number) => {
      return `${label} : ${this.data()[index]}`;
    });

    return {
      labels,
      datasets: [
        {
          data: !this.calculateTotal() ? this.data().map(() => 1) : this.data(),
          backgroundColor: this.backgroundColors(),
          editTooltip: !!this.calculateTotal(),
        },
      ],
    };
  }

  initDisplayOptions() {
    if (!this.labels().length && !this.data().length) return;
    return {
      plugins: {
        legend: {
          position: this.currentLang() === "ar" ? "right" : "left",
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem: any) {
              let label = tooltipItem.dataset.label || "";
              let value = tooltipItem.raw;
              return `${
                !tooltipItem.dataset.editTooltip ? `${label}:  0` : `${label}: ${value.toFixed(2)}`
              }`;
            },
          },
        },
      },
      cutout: this.cutout(),
      centerText: {
        display: true,
        text: this.calculateTotal(),
      },
    };
  }

  calculateTotal() {
    return this.data().reduce((total: number, value: number) => {
      return total + value;
    }, 0);
  }

  registerCenterTextPlugin() {
    return {
      id: "centerText",
      beforeDraw: (chart: any) => {
        const {
          ctx,
          chartArea: { top, bottom, left, right },
          config,
        } = chart;
        let centerText = config.options.centerText;
        if (centerText.display) {
          ctx.save();
          ctx.font = "18px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#666876"; // Text color
          const centerX = (left + right) / 2;
          const centerY = (top + bottom) / 2;
          ctx.fillText(centerText.text, centerX, centerY);
          ctx.restore();
        }
      },
    };
  }

  ngOnDestroy() {
    Chart.unregister(this.registerCenterTextPlugin());
  }
}
