import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [ChartModule],
  template: `
      @if (labels() && datasets()) {
      <div class="mt-3">
        <p-chart type="bar" [data]="dataChart" [options]="options"></p-chart>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartBarComponent {
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
      aspectRatio: 0.8,
      scales: {
        x: {
          ticks: {
            font: {
              weight: 500
            }
          },
          grid: {
            drawBorder: false
          }
        },
        y: {
          grid: {
            drawBorder: false
          }
        }
      }
    };
  }
}
