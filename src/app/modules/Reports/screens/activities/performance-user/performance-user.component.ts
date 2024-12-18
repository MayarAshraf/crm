import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  computed,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { ReportsService } from "@modules/Reports/Services/get-report.service";
import { BoxCardComponent, RangePipe } from "@shared";
import { AvatarModule } from "primeng/avatar";
import { CardModule } from "primeng/card";
import { SkeletonModule } from "primeng/skeleton";
import { TabViewModule } from "primeng/tabview";
import { catchError, of, tap } from "rxjs";

export interface PerformanceUser {
  label: string;
  value: number;
}
@Component({
  selector: "app-performance-user",
  standalone: true,
  imports: [AvatarModule, SkeletonModule, CardModule, RangePipe, BoxCardComponent, TabViewModule],
  templateUrl: "./performance-user.component.html",
  styleUrl: "./performance-user.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PerformanceUserComponent {
  @Input() id!: number;

  #route = inject(ActivatedRoute);
  #report = inject(ReportsService);
  #destroyRef = inject(DestroyRef);

  dateRange = this.#report.dateRange;
  isLoading = this.#report.isLoading;

  srcImage = signal(this.#route.snapshot.queryParams["srcImage"]);
  fullName = signal(this.#route.snapshot.queryParams["fullName"]);
  jobTitle = signal(this.#route.snapshot.queryParams["jobTitle"]);
  joinData = signal(this.#route.snapshot.queryParams["joinData"]);
  lastLogin = signal(this.#route.snapshot.queryParams["lastLogin"]);
  group = signal(this.#route.snapshot.queryParams["group"]);

  changeDateRange$ = toObservable(this.#report.dateRange).pipe(
    takeUntilDestroyed(this.#destroyRef),
    tap(dates => {
      this.#report.filterReport({
        slug: "performance-report",
        start_date: dates[0],
        end_date: dates[1],
        subdomain_id: 1,
        user_id: +this.id,
      });
    }),
    catchError(() => {
      return of([]);
    }),
  );

  loadReportDataOnly = toSignal(this.#report.filterData$, { initialValue: {} });
  loadDateRangeOnly = toSignal(this.changeDateRange$, { initialValue: [] });

  performanceUser = computed<PerformanceUser[]>(() => this.loadReportDataOnly());
}
