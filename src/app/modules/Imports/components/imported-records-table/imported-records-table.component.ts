import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { LccaPermissionsService } from "@modules/Leads/services/lcca-permissions.service";
import { TranslateModule } from "@ngx-translate/core";
import {
  ApiService,
  AuthService,
  CachedLabelsService,
  ConfirmService,
  constants,
  DataTableColumn,
  DateFormatterPipe,
  EnabledModuleService,
  FiltersData,
  PermissioneVisibilityDirective,
  TableWrapperComponent,
} from "@shared";
import { LazyLoadEvent } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { switchMap, tap } from "rxjs";

export interface ImportRecord {
  id: number;
  file: string;
  created_by: number;
  created_at: string;
  media_file_id: number;
  import_status: string;
  file_type: string;
  import_status_id: null;
  total_records_count: null;
  invalid_records_count: null;
  valid_records_count: null;
  non_duplicate_records_count: null;
  duplicate_records_count: null;
}

@Component({
  selector: "app-imported-records-table",
  standalone: true,
  imports: [
    TableWrapperComponent,
    ButtonModule,
    TooltipModule,
    PermissioneVisibilityDirective,
    TranslateModule,
    DateFormatterPipe,
  ],
  templateUrl: "./imported-records-table.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportedRecordsTableComponent {
  #api = inject(ApiService);
  #enabledModule = inject(EnabledModuleService);
  #lccaPermissions = inject(LccaPermissionsService);
  #auth = inject(AuthService);
  #cachedLabels = inject(CachedLabelsService);
  #confirmService = inject(ConfirmService);
  #destroyRef = inject(DestroyRef);

  moduleName = this.#enabledModule.hasModule(constants.modulesNames["Imports Module"]);

  file = viewChild.required<TemplateRef<any>>("file");
  importStatus = viewChild.required<TemplateRef<any>>("importStatus");

  columns = signal<DataTableColumn[]>([]);
  records = signal<ImportRecord[]>([]);
  isLoading = signal(false);
  totalRecords = signal<number>(0);
  recordsFiltered = signal<number>(0);
  filtersData = model<FiltersData>({} as FiltersData);
  permissions = signal<{ [key: string]: boolean }>({});

  importModel = input.required();
  leadTypeId = input.required<number>();
  onImportClicked = output<ImportRecord>();

  getLabelById(listKey: string, id: number | null) {
    return this.#cachedLabels.getLabelById(listKey, id as number);
  }

  ngOnInit() {
    this.permissions.set({
      index: this.#lccaPermissions.checkPermission(this.leadTypeId(), "import-??", true),
      delete: this.#auth.currentUser()?.id === 1,
    });

    this.columns.set([
      { name: "file", title: "File", render: this.file() },
      { name: "import_status", title: "Import Status", render: this.importStatus() },
      { name: "total_records_count", title: "Total Records Count" },
      { name: "invalid_records_count", title: "Invalid Records Count" },
      { name: "valid_records_count", title: "Valid Records Count" },
      { name: "non_duplicate_records_count", title: "Non Duplicate Records Count" },
      { name: "duplicate_records_count", title: "Duplicate Records Count" },
    ]);
  }

  loadRecords$ = toObservable(this.filtersData).pipe(
    tap(() => this.isLoading.set(true)),
    switchMap(filters => {
      return this.#api
        .request<any, any>("post", "imports/imports/index", {
          ...filters,
          import_model: this.importModel(),
        })
        .pipe(
          tap(data => {
            this.records.set(data.data);
            this.totalRecords.set(data.recordsTotal);
            this.recordsFiltered.set(data.recordsFiltered);
            this.isLoading.set(false);
          }),
        );
    }),
  );

  loadRecordsReadOnly = toSignal(this.loadRecords$, { initialValue: {} });

  loadRecords(event: LazyLoadEvent) {
    this.filtersData.update(oldFilters => {
      return {
        ...oldFilters,
        length: event.rows,
        start: event.first || 0,
        search: { value: null, regex: false },
        columns: this.columns().map(({ render, ...col }) => col),
      };
    });
  }

  confirmDelete(id: number) {
    this.#confirmService.confirmDelete({
      acceptCallback: () => {
        this.#api
          .request("post", "imports/imports/delete", { id })
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe(() => {
            this.records.update(records => records.filter(i => i.id !== id));
            this.totalRecords.update(totalRecords => totalRecords - 1);
            this.recordsFiltered.update(recordsFiltered => recordsFiltered - 1);
          });
      },
    });
  }
}
