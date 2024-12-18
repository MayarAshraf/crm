import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ReportsService } from "@modules/Reports/Services/get-report.service";
import { SearchAgentModel } from "@modules/Reports/Services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  CachedListsService,
  DataTableColumn,
  TableWrapperComponent,
} from "@shared";
import * as FileSaver from "file-saver";
import { LazyLoadEvent } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { MultiSelectModule } from "primeng/multiselect";
import { TooltipModule } from "primeng/tooltip";
import { catchError, of, tap } from "rxjs";
import { SearchAgentsComponent } from "./search-agents/search-agents.component";

interface ExportColumn {
  title: string | null | undefined;
  dataKey: string | null | undefined;
}
export interface AgentReport {
  data: Agent[];
  recordsTotal: number;
  recordsFiltered: number;
}
export interface Agent {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  report: { label: string; value: number }[];
}

@Component({
  selector: "app-agents",
  standalone: true,
  imports: [
    MultiSelectModule,
    ButtonModule,
    FormsModule,
    TableWrapperComponent,
    SearchAgentsComponent,
    TooltipModule,
    TranslateModule,
  ],
  templateUrl: "./agents.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AgentsComponent extends BaseIndexComponent<Agent> {
  #report = inject(ReportsService);
  #cachedLists = inject(CachedListsService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  loading = this.#report.isLoading;

  selectedColumns = [
    { title: "", name: "", searchable: false, orderable: false },
    { title: "", name: "", searchable: false, orderable: false },
  ];
  originalColumns!: DataTableColumn[];
  exportColumns!: ExportColumn[];

  groupsIds = signal<number[] | null>(null);
  usersIds = signal<number[] | null>(null);

  changeDateRange$ = toObservable(this.#report.dateRange).pipe(
    takeUntilDestroyed(this.#destroyRef),
    tap(dates => {
      this.#report.filterReport({
        slug: "agents-report",
        type: "datatable",
        subdomain_id: 2,
        users_ids: this.usersIds() || null,
        groups_ids: this.groupsIds() || null,
        length: 10,
        start: 0,
        start_date: dates[0],
        end_date: dates[1],
      });
    }),
    catchError(() => {
      return of([]);
    }),
  );
  loadDateRangeOnly = toSignal(this.changeDateRange$, { initialValue: [] });
  loadReportDataOnly = toSignal(this.#report.filterData$, { initialValue: {} });

  getDataReport = computed<AgentReport>(() => this.loadReportDataOnly());
  recordsAgents = computed(() => {
    const recordsAgents: Agent[] = this.getDataReport().data;

    if (!recordsAgents) {
      return [] as Agent[];
    }

    const newRecords = recordsAgents.map(({ report, ...rest }) => {
      return {
        ...rest,
        ...Object.fromEntries(report.flatMap(({ label, value }) => [[label, value]])),
      };
    });

    this.selectedColumns = [
      { title: "name", name: "name", searchable: false, orderable: false },
      ...recordsAgents[0].report.map(item => ({
        title: item.label,
        name: item.label,
        searchable: false,
        orderable: false,
      })),
    ];

    this.originalColumns = this.selectedColumns;

    this.exportColumns = this.originalColumns.map(col => ({
      title: col.title,
      dataKey: col.name,
    }));

    return newRecords;
  });

  ngOnInit() {
    this.#cachedLists.updateLists(["assignments:users", "assignments:groups"]);

    this.permissions.set({ index: true });

    this.indexMeta = {
      ...this.indexMeta,
      indexTableKey: "AGENTS_REPORTS",
    };
  }

  override loadRecords(event: LazyLoadEvent) {
    this.#report.updateFilterReport({
      length: event.rows,
      start: event.first || 0,
    });
  }

  onFilterChange(SearchAgentModel: SearchAgentModel) {
    this.groupsIds.set(SearchAgentModel.users_ids);
    this.usersIds.set(SearchAgentModel.groups_ids);
    this.#report.updateFilterReport(SearchAgentModel);
  }

  onResetChange() {
    this.#report.updateFilterReport({
      length: 10,
      start: 0,
      users_ids: null,
      groups_ids: null,
    });
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.recordsAgents());
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: "xlsx", type: "array" });
      this.saveAsExcelFile(excelBuffer, "recordsAgents");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION);
  }
}
