import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { LangService } from "@shared";
import { Chart, registerables } from "chart.js";
import { ChartModule } from "primeng/chart";
import { SkeletonModule } from "primeng/skeleton";

Chart.register(...registerables);

@Component({
  selector: "app-pie-chrat",
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
export class ChratPieComponent {
  currentLang = inject(LangService).currentLanguage;
  data = input.required<number[]>();
  labels = input.required<string[]>();

  cutout = input<string>("70%");
  width = input<string>("150");
  isLoading = input<boolean>(true);

  dataChart = computed(() => this.initDisplayChart());
  options = computed(() => this.initDisplayOptions());

  ngOnInit() {
    Chart.register(this.registerCenterTextPlugin());
  }

  initDisplayChart() {
    return {
      labels: this.labels(),
      datasets: [
        {
          data: this.data(),
        },
      ],
    };
  }

  initDisplayOptions() {
    return {
      cutout: this.cutout(),
      centerText: {
        display: true,
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
          tooltip,
        } = chart;

        ctx.save();
        ctx.font = "16px Arial";
        ctx.fillStyle = "#666876";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;

        ctx.fillText(this.getCenterText(chart, tooltip, centerX, centerY), centerX, centerY);

        ctx.restore();
      },
    };
  }

  getCenterText(chart: any, tooltip: any, centerX: any, centerY: any) {
    if (tooltip && tooltip._active && tooltip._active.length) {
      const activePoint = tooltip._active[0];

      if (activePoint && activePoint.element && activePoint.datasetIndex !== undefined) {
        const index = activePoint.index;
        const label = chart.data.labels[index];
        const rawValue = chart.data.datasets[0]?.data[index];
        const value = typeof rawValue === "number" ? rawValue.toFixed(2) : "N/A";

        return `${label}: ${value}`;
      }
    }
    return "";
  }

  ngOnDestroy() {
    Chart.unregister(this.registerCenterTextPlugin());
  }
}
