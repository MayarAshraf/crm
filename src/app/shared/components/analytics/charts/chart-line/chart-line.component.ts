import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ChartModule } from "primeng/chart";

@Component({
  selector: "app-chart-line",
  standalone: true,
  imports: [ChartModule],
  template: `
    @if (labels() && datasets()) {
      <div class="mt-3">
        <p-chart type="line" [data]="dataChart" [options]="options"></p-chart>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLineComponent {
  labels = input.required<string[]>();
  datasets = input.required<{ [key: string]: any }[]>();

  options!: { [key: string]: any };
  dataChart!: { [key: string]: any };

  ngOnInit() {
    this.dataChart = {
      labels: this.labels(),
      datasets: this.datasets(),
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
    };
  }
}
