import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ExportsFiltersService } from "@modules/Exports/services/exports-filters.service";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  CachedLabelsService,
  CachedListsService,
  ConfirmService,
  constants,
  EnabledModuleService,
  FilterConfig,
  FiltersPanelComponent,
  PermissioneVisibilityDirective,
  PermissionsService,
  TableWrapperComponent,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { filter, tap } from "rxjs";
import { DownloadFileComponent } from "../download-file/download-file.component";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-exports",
  standalone: true,
  imports: [
    FiltersPanelComponent,
    PermissioneVisibilityDirective,
    TableWrapperComponent,
    ButtonModule,
    RouterLink,
    DownloadFileComponent,
    TooltipModule,
    TranslateModule
  ],
  templateUrl: "./exports.component.html",
  styleUrl: "./exports.component.scss",
  providers: [ExportsFiltersService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExportsComponent extends BaseIndexComponent<any> {
  #enabledModule = inject(EnabledModuleService);
  #cachedLists = inject(CachedListsService);
  #userPermission = inject(PermissionsService);
  #exportsFilters = inject(ExportsFiltersService);
  #confirmService = inject(ConfirmService);
  #cachedLabels = inject(CachedLabelsService);

  file = viewChild.required<TemplateRef<any>>("file");
  exportBy = viewChild<TemplateRef<any>>("exportBy");

  showBasicFilters = signal(false);
  showAdvancedFilters = signal(true);

  exportsFilters = computed<FilterConfig[]>(() => this.#exportsFilters.getExportsFilters());

  getLabelById(listKey: string, id: number) {
    return this.#cachedLabels.getLabelById(listKey, id);
  }

  mainLists = ["assignments:all_users_info"];
  basicFiltersLists = ["assignments:users", "exports:export_types"];

  cachedLists = computed(() => {
    let lists = [...this.mainLists];
    if (this.showBasicFilters()) {
      lists = [...lists, ...this.basicFiltersLists];
    }
    return lists;
  });

  cachedLists$ = toObservable(this.cachedLists).pipe(
    filter(e => e.length > 0),
    tap(list => this.#cachedLists.updateLists(list)),
  );

  loadCashedLists = toSignal(this.cachedLists$, { initialValue: [] });

  ngOnInit() {
    this.#exportsFilters.exportersName = "exporters_ids";
    this.permissions.set({
      index: this.#userPermission.hasAnyPermissions([
        constants.permissions["index-exported-files"],
      ]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-exported-file"]),
      download: this.#userPermission.hasPermission(constants.permissions["view-exported-file"]),
    });

    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Exports Module"]);

    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: this.translate.instant(_("exports")),
      indexIcon: "fas fa-file-download",
      endpoints: { index: "exports/exports", delete: "exports/exports/delete" },
      indexApiVersion: "v2",
      deleteApiVersion: "v2",
      indexTableKey: "EXPORTS_KEY",
      columns: [
        {
          title: this.translate.instant(_("file")),
          name: "file",
          searchable: false,
          orderable: false,
          render: this.file(),
        },
        {
          title: this.translate.instant(_("export_type")),
          name: "export_type",
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("export_ip")),
          name: "export_ip",
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("exported_at")),
          name: "created_at",
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("exported_by")),
          name: "export_by",
          render: this.exportBy(),
          searchable: false,
          orderable: false,
        },
      ],
    };
  }

  refreshExports(filters: Record<string, any>) {
    this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }));
  }

  confirmDelete(rowData: any) {
    this.#confirmService.confirmDelete({
      acceptCallback: () => this.deleteRecord(rowData),
    });
  }
}
