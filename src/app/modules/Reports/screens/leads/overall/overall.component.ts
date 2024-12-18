import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from "@angular/core";
import { ReportsService } from "@modules/Reports/Services/get-report.service";
import {
  ChartPieTotalCenterComponent,
  ChartService,
  ChratPieComponent,
  DefaultScreenHeaderComponent,
  RangePipe,
  constants,
} from "@shared";
import { DividerModule } from "primeng/divider";
import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: "app-overall",
  standalone: true,
  imports: [
    DividerModule,
    ChartPieTotalCenterComponent,
    RangePipe,
    SkeletonModule,
    DefaultScreenHeaderComponent,
  ],
  templateUrl: "./overall.component.html",
  styleUrl: "./overall.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OverallComponent {
  #report = inject(ReportsService);
  #chart = inject(ChartService);
  #destroyRef = inject(DestroyRef);
  isLoading = signal(false);

  // charts$ = toObservable(this.#report.dateRange).pipe(
  //   filter(v => !!v),
  //   switchMap(dates => {
  //     return this.#chart
  //       .getCharts({
  //         charts: [
  //           "overall_calls",
  //           "overall_message",
  //           "overall_meetings",
  //           "overall_tasks",
  //           "overall_events",
  //           "overall_tens",
  //         ],
  //         date_range: dates,
  //       })
  //       .pipe(
  //         map(data => data),
  //         takeUntilDestroyed(this.#destroyRef),
  //       );
  //   }),
  //   catchError(() => {
  //     return of([]);
  //   }),
  // );
  // loadChartsOnly = toSignal(this.charts$, { initialValue: [] });

  constants = constants;
}
