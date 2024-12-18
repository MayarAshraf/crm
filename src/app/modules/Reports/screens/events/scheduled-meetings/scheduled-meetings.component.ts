import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ReportsService } from "@modules/Reports/Services/get-report.service";
import {
  ChartPieTotalCenterComponent,
  ChartService,
  DefaultScreenHeaderComponent,
  RangePipe,
  TableWrapperComponent,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";
import { catchError, filter, map, of, switchMap } from "rxjs";

export interface ScheduledMettings {
  data: {
    datasets: {
      backgroundColor: string[];
      data: number[];
      labels: string[];
    };
    subtitle: string;
    title: string;
    type: string;
  }[];
}

@Component({
  selector: "app-scheduled-meetings",
  standalone: true,
  imports: [
    TableWrapperComponent,
    AsyncPipe,
    DefaultScreenHeaderComponent,
    SkeletonModule,
    ChartPieTotalCenterComponent,
    RangePipe,
    ButtonModule,
  ],
  templateUrl: "./scheduled-meetings.component.html",
  styleUrl: "./scheduled-meetings.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ScheduledMeetingsComponent {
  #report = inject(ReportsService);
  #chart = inject(ChartService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  isLoading = signal(false);

  charts$ = toObservable(this.#report.dateRange).pipe(
    filter(v => !!v),
    switchMap(dates => {
      return this.#chart
        .getCharts({
          charts: ["overall_events_by_type", "overall_events_by_status"],
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
