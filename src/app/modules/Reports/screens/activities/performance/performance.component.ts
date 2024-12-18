import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ReportsService } from "@modules/Reports/Services/get-report.service";
import { UserPerformance } from "@modules/Reports/Services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { ApiService, CachedListsService, FiltersData, RangePipe } from "@shared";
import { LazyLoadEvent } from "primeng/api";
import { DataViewModule } from "primeng/dataview";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectChangeEvent, MultiSelectModule } from "primeng/multiselect";
import { SkeletonModule } from "primeng/skeleton";
import { catchError, filter, map, of, switchMap, tap } from "rxjs";
import { CardUserComponent } from "./card-user/card-user.component";

@Component({
  selector: "app-performance",
  standalone: true,
  imports: [
    CardUserComponent,
    RangePipe,
    NgClass,
    TranslateModule,
    SkeletonModule,
    FormsModule,
    DataViewModule,
    MultiSelectModule,
    InputTextModule,
  ],
  templateUrl: "./performance.component.html",
  styleUrl: "./performance.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PerformanceComponent {
  #cachedLists = inject(CachedListsService);
  #api = inject(ApiService);
  dateRange = inject(ReportsService).filterData;

  selectedGroupUsers!: number[];
  valueInput = "";

  groupUsers = computed(() => {
    const listGroups = this.#cachedLists.loadLists().get("assignments:groups") ?? [];
    this.selectedGroupUsers = listGroups.map(
      (item: { value: number; label: string }) => item.value,
    );
    return listGroups;
  });

  filtersData = signal<FiltersData>({} as FiltersData);
  isLoading = signal(true);
  records = signal<UserPerformance[]>([]);
  originalRecords = signal<UserPerformance[]>([]);
  totalRecords = signal<number>(0);
  recordsFiltered = signal<number>(0);

  loadRecords$ = toObservable(this.filtersData).pipe(
    filter(() => Object.keys(this.filtersData()).length > 0),
    tap(() => this.isLoading.set(true)),
    switchMap(filters => {
      const urlEndPoint = "users/index";
      return this.#api.request("post", urlEndPoint, filters).pipe(
        map(({ data }) => data),
        map(data => ({
          data: data.data.map((item: any) => ({ ...item, styleClass: "scale-in-center" })),
          recordsTotal: data.recordsTotal,
          recordsFiltered: data.recordsFiltered,
        })),
        tap(data => {
          this.records.set(data.data);
          this.originalRecords.set(data.data);
          this.totalRecords.set(data.recordsTotal);
          this.recordsFiltered.set(data.recordsFiltered);
          this.isLoading.set(false);
        }),
        catchError(() => {
          return of({});
        }),
      );
    }),
  );

  filterRecords(event: MultiSelectChangeEvent) {
    const groupIDs = event.value;
    this.records.update(oldRecords => {
      return oldRecords.map(item => ({
        ...item,
        styleClass: groupIDs.includes(item.group_id) ? "scale-in-center" : "scale-out-center",
      }));
    });
  }

  onInputChange(query: string) {
    let filterUser = [...this.originalRecords()];

    filterUser = this.originalRecords().filter(item =>
      item.full_name.toLowerCase().includes(query.toLowerCase()),
    );
    this.records.set(filterUser);
  }

  ngOnInit() {
    this.#cachedLists.updateLists(["assignments:groups"]);
  }

  loadRecords(event: LazyLoadEvent) {
    this.isLoading.set(true);
    this.filtersData.update(oldFilters => {
      return {
        ...oldFilters,
        length: event.rows,
        start: event.first || 0,
        search: { value: null, regex: false },
        columns: [
          { name: "id", title: "#ID" },
          { name: "full_name", title: "Name" },
          { name: "group.name", title: "Group" },
          { name: "created_at", title: "Created At" },
          { name: "creator.full_name", title: "Created By" },
          { name: "updated_at", title: "Updated At" },
        ],
        order: [{ column: 0, dir: "asc" }],
      };
    });
  }
  users = toSignal<any, any>(this.loadRecords$, { initialValue: {} });
}
