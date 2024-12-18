import { DOCUMENT, KeyValuePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Renderer2,
  TemplateRef,
  computed,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { SystemLog } from "@modules/Reports/Services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  CachedListsService,
  DataTableColumn,
  EnabledModuleService,
  TableWrapperComponent,
  constants,
} from "@shared";
import * as FileSaver from "file-saver";
import { ButtonModule } from "primeng/button";
import { MultiSelectModule } from "primeng/multiselect";
import { TooltipModule } from "primeng/tooltip";
import { SearchLoggerComponent } from "./search-logger/search-logger.component";

interface ExportColumn {
  title: string | null | undefined;
  dataKey: string | null | undefined;
}

@Component({
  selector: "app-system-logs",
  standalone: true,
  templateUrl: "./system-logs.component.html",
  styleUrl: "./system-logs.component.scss",
  imports: [
    KeyValuePipe,
    ButtonModule,
    TooltipModule,
    MultiSelectModule,
    FormsModule,
    TableWrapperComponent,
    SearchLoggerComponent,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SystemLogsComponent extends BaseIndexComponent<SystemLog> {
  #renderer = inject(Renderer2);
  #cachedLists = inject(CachedListsService);
  #document = inject(DOCUMENT);
  #enabledModule = inject(EnabledModuleService);

  selectedColumns = signal<DataTableColumn[]>([]);

  computedColumns = computed(() =>
    this.indexMeta.columns.filter(col => this.selectedColumns().includes(col)),
  );

  exportColumns!: ExportColumn[];

  logChanges = viewChild.required<TemplateRef<any>>("logChanges");
  creator = viewChild.required<TemplateRef<any>>("creator");

  ngOnInit() {
    this.#cachedLists.updateLists([
      "assignments:users",
      "assignments:groups",
      "system_logs:activity_log_types",
    ]);

    this.permissions.set({
      index: true,
      create: true,
      update: true,
      delete: true,
    });
    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Logger Module"]);
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: "logger/index" },
      indexTitle: this.translate.instant(_("logs")),
      indexTableKey: "SYSTEM_LOGS",
      indexIcon: "fas fa-fingerprint",
      columns: [
        {
          name: "created_at",
          title: this.translate.instant(_("event_time")),
          searchable: true,
        },
        {
          name: "causer_name",
          title: this.translate.instant(_("creator")),
          render: this.creator(),
          searchable: true,
        },
        { name: "subject", title: this.translate.instant(_("record_type")), searchable: true },
        { name: "description", title: this.translate.instant(_("description")), searchable: true },
        { name: "log_name", title: this.translate.instant(_("log_type")), searchable: true },
        { name: "log", title: this.translate.instant(_("changes")), render: this.logChanges() },
      ],
    };
    this.selectedColumns.set(this.indexMeta.columns);

    this.#renderer.addClass(this.#document.body, "system-logs-page");

    this.exportColumns = this.indexMeta.columns.map(col => ({
      title: col.title,
      dataKey: col.name,
    }));
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default("p", "px", "a4");
        (doc as any).autoTable(this.exportColumns, this.records());
        doc.save("records.pdf");
      });
    });
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.records());
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: "xlsx", type: "array" });
      this.saveAsExcelFile(excelBuffer, "records");
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

  print() {
    window.print();
  }

  assertChangeType(value: unknown): { new: string; old: string } {
    return value as { new: string; old: string };
  }

  ngOnDestroy(): void {
    this.#renderer.removeClass(this.#document.body, "system-logs-page");
  }
}
