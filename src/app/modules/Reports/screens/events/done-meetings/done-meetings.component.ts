import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject } from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ReportsService } from "@modules/Reports/Services/get-report.service";
import {
  BaseIndexComponent,
  ChratPieComponent,
  DefaultScreenHeaderComponent,
  PermissioneVisibilityDirective,
  RangePipe,
  TableWrapperComponent,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { MenuModule } from "primeng/menu";
import { SkeletonModule } from "primeng/skeleton";
import { TooltipModule } from "primeng/tooltip";
import { catchError, of, tap } from "rxjs";
export interface DoneMeetings {
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
  selector: "app-done-meetings",
  standalone: true,
  imports: [
    AsyncPipe,
    PermissioneVisibilityDirective,
    DropdownModule,
    DefaultScreenHeaderComponent,
    ChratPieComponent,
    SkeletonModule,
    RangePipe,
    FormsModule,
    MenuModule,
    ButtonModule,
    TooltipModule,
    TableWrapperComponent,
  ],
  templateUrl: "./done-meetings.component.html",
  styleUrl: "./done-meetings.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DoneMeetingsComponent extends BaseIndexComponent<any> {
  #report = inject(ReportsService);
  Loading = this.#report.isLoading;
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  changeDateRange$ = toObservable(this.#report.dateRange).pipe(
    takeUntilDestroyed(this.#destroyRef),
    tap(dates => {
      this.#report.filterReport({
        slug: "meetings",
        type: "chart",
        subdomain_id: 1,
        start_date: dates[0],
        end_date: dates[1],
      });
    }),
    catchError(() => {
      return of([]);
    }),
  );

  loadReportDataOnly = toSignal(this.#report.filterData$, { initialValue: {} });
  loadDateRangeOnly = toSignal(this.changeDateRange$, { initialValue: [] });

  doneMettings = computed<DoneMeetings>(() => this.loadReportDataOnly());
}
