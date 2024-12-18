import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ReportsService } from "@modules/Reports/Services/get-report.service";
import {
  ChartPieTotalCenterComponent,
  ChartService,
  DefaultScreenHeaderComponent,
  KebabCasePipe,
  RangePipe,
} from "@shared";
import { ProgressBarModule } from "primeng/progressbar";
import { SkeletonModule } from "primeng/skeleton";
import { catchError, filter, map, of, switchMap, tap } from "rxjs";

@Component({
  selector: "app-overall",
  standalone: true,
  imports: [
    ChartPieTotalCenterComponent,
    SkeletonModule,
    NgClass,
    RangePipe,
    KebabCasePipe,
    DefaultScreenHeaderComponent,
    ProgressBarModule,
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

  charts$ = toObservable(this.#report.dateRange).pipe(
    filter(v => !!v),
    switchMap(dates => {
      return this.#chart
        .getCharts({
          charts: [
            "overall_calls",
            "overall_message",
            "overall_meetings",
            "overall_tasks",
            "overall_events",
            "overall_tens",
          ],
          date_range: dates,
        })
        .pipe(
          map(data => data),
          takeUntilDestroyed(this.#destroyRef),
        );
    }),
    catchError(() => {
      return of([]);
    }),
  );

  loadChartsOnly = toSignal(this.charts$, { initialValue: [] });
}
