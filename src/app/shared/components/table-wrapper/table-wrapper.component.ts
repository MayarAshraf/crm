import { DecimalPipe, NgClass, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChild,
  inject,
  input,
  model,
  output,
  viewChild,
} from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NgxTranslateCutModule } from "ngx-translate-cut";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { InputTextModule } from "primeng/inputtext";
import { SkeletonModule } from "primeng/skeleton";
import { Table, TableModule, TableService } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import {
  ModuleVisibilityDirective,
  PermissioneVisibilityDirective,
} from "src/app/shared/directives";
import { DateFormatterPipe, NestedPropertyPipe, RangePipe } from "src/app/shared/pipes";
import { constants } from "../../config";
import { CachedLabelsService, ConfirmService, DataTableColumn, LangService } from "../../services";

export function tableFactory(table: TableWrapperComponent): Table {
  return table.primengTable();
}

@Component({
  selector: "app-table-wrapper",
  templateUrl: "./table-wrapper.component.html",
  styleUrls: ["./table-wrapper.component.scss"],
  standalone: true,
  providers: [
    DecimalPipe,
    TableService,
    {
      provide: Table,
      useFactory: tableFactory,
      deps: [TableWrapperComponent],
    },
  ],
  imports: [
    ModuleVisibilityDirective,
    NgTemplateOutlet,
    NgClass,
    RangePipe,
    SkeletonModule,
    InputTextModule,
    CardModule,
    NestedPropertyPipe,
    DividerModule,
    ButtonModule,
    TooltipModule,
    TranslateModule,
    NgxTranslateCutModule,
    TableModule,
    PermissioneVisibilityDirective,
    DateFormatterPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableWrapperComponent {
  #translate = inject(TranslateService);
  #confirmService = inject(ConfirmService);
  #decimalPipe = inject(DecimalPipe);
  #cachedLabels = inject(CachedLabelsService);
  currentLang = inject(LangService).currentLanguage;

  additionalContentTemplate = contentChild<TemplateRef<any>>("additionalContentTemplate");
  customFiltersTemplate = contentChild<TemplateRef<any>>("customFiltersTemplate");
  headerTemplate = contentChild<TemplateRef<any>>("headerTemplate");
  actionsTemplate = contentChild<TemplateRef<any>>("actionsTemplate");
  extendDefaultActionsTemplate = contentChild<TemplateRef<any>>("extendDefaultActionsTemplate");
  bodyTemplate = contentChild<TemplateRef<any>>("bodyTemplate");
  loadingBodyTemplate = contentChild<TemplateRef<any>>("loadingBodyTemplate");
  expandedRowTemplate = contentChild<TemplateRef<any>>("expandedRowTemplate");
  primengTable = viewChild.required<Table>("primengTable");

  constants = constants;
  showScrollHint = model(true);
  isListLayout = model(true);
  withMultiLayout = input(false);
  moduleName = input<boolean>(true);
  withScreenHeader = input(true);
  withCustomFilters = input(false);
  withActionsColumn = input(true);
  displayHeaderButton = input(true);
  indexPermissions = input<boolean>(false);
  createBtnPermissions = input<boolean>(false);
  updateBtnPermissions = input<boolean>(false);
  deleteBtnPermissions = input<boolean>(false);
  withResetButton = input(true);
  headerTitle = input<string>();
  headerSubTitle = input<string>();
  titleIcon = input<string>();
  titleClass = input<string>();
  headerBtnLabel = input<string>("");
  withAdditionalContent = input(false);
  dataSource = input<any[]>([]);
  columns = input<DataTableColumn[]>([]);
  reorderableColumns = input(false);
  reorderableRows = input(false);
  responsiveLayout = input("scroll"); // "scroll" | "stack"
  breakpoint = input("767px");
  dataKey = input("id");
  stateKey = input<string>();
  rowExpandMode = input<"single" | "multiple">("single");
  totalRecords = input(0);
  recordsFiltered = input<number>();
  editMode = input<"cell" | "row">("cell"); // "cell" | "row"
  rowHover = input(false);
  lazy = input(true);
  lazyLoadOnInit = input(true);
  rows = input(constants.TABLE_ROWS_LENGTH);
  loading = input(false);
  showCurrentPageReport = input(true);
  rowsPerPageOptions = input<number[] | undefined>([5, 10, 20, 30, 50]);
  paginator = input(true);
  paginatorPosition = input<"both" | "top" | "bottom">("bottom");
  globalFilterFields = input<string[]>([]);
  globalFilterValue = input<string | null>();
  withSelection = input(false);
  selectionMode = input<"single" | "multiple" | null>(null); // "single" | "multiple"
  selectionPageOnly = input(true);
  selection = model<any>();
  withTableSearch = input(true);
  showGridlines = input(true);
  showStriped = input(false);
  styleClass = input<string>();

  onLoadData = output<any>();
  selectionChange = output<any>();
  selectAllChange = output<any>();
  editComplete = output<any>();
  columnSortChange = output();
  onRowReorder = output<any>();
  createBtnClicked = output();
  updateBtnClicked = output();
  deleteBtnClicked = output<any>();
  onStateSave = output<any>();
  onStateRestore = output<any>();

  removeScrollHint() {
    if (!this.showScrollHint()) return;
    this.showScrollHint.set(false);
  }

  #formatNumber(num: number | undefined): string {
    return this.#decimalPipe.transform(num, "1.0-0") || "";
  }

  currentPageReport = computed(() => {
    const filteredFrom = this.globalFilterValue()
      ? ` (${this.#translate.instant(_("report_table.filtered_from"))} ${this.#formatNumber(
          this.totalRecords(),
        )} ${this.#translate.instant(_("total_entries"))})`
      : "";

    const showing = this.#translate.instant(_("report_table.showing"));
    const toRecords = this.#translate.instant(_("report_table.to"));
    const ofRecords = this.#translate.instant(_("report_table.of"));

    const first = this.recordsFiltered() === 0 ? 0 : "{first}";
    const last = this.recordsFiltered() === 0 ? 0 : "{last}";

    return !this.loading()
      ? `${showing} ${first} ${toRecords} ${last} ${ofRecords} ${this.#formatNumber(
          this.recordsFiltered(),
        )} ${this.#translate.instant(_("entries"))} ${filteredFrom}`
      : "";
  });

  getTableClass() {
    return `
      p-datatable-sm
      ${this.styleClass()}
      ${this.showGridlines() ? "p-datatable-gridlines" : ""}
      ${this.showStriped() ? "p-datatable-striped" : ""}
      ${this.isListLayout() && this.withMultiLayout() ? "list-layout" : ""}
      ${!this.isListLayout() && this.withMultiLayout() ? "grid-layout" : ""}
    `;
  }

  getLabelById(listKey: string, id: number) {
    return this.#cachedLabels.getLabelById(listKey, id);
  }

  confirmDelete(rowData: any) {
    this.#confirmService.confirmDelete({
      acceptCallback: () => this.deleteBtnClicked.emit(rowData),
    });
  }

  resetTable() {
    this.primengTable().reset();
    this.primengTable().clearState();
    this.selectionChange.emit([]);
  }
}
