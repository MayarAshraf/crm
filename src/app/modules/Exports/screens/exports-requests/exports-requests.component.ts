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
  constants,
  EnabledModuleService,
  FilterConfig,
  FiltersPanelComponent,
  PermissionsService,
  TableWrapperComponent,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { filter, tap } from "rxjs";

@Component({
  selector: "app-exports-requests",
  standalone: true,
  imports: [
    FiltersPanelComponent,
    TableWrapperComponent,
    ButtonModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: "./exports-requests.component.html",
  styleUrl: "./exports-requests.component.scss",
  providers: [ExportsFiltersService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExportsRequestsComponent extends BaseIndexComponent<any> {
  #enabledModule = inject(EnabledModuleService);
  #cachedLists = inject(CachedListsService);
  #userPermission = inject(PermissionsService);
  #exportRequestsFilters = inject(ExportsFiltersService);
  #cachedLabels = inject(CachedLabelsService);

  exportBy = viewChild<TemplateRef<any>>("exportBy");

  showBasicFilters = signal(false);
  showAdvancedFilters = signal(true);

  exportRequestsFilters = computed<FilterConfig[]>(() =>
    this.#exportRequestsFilters.getExportsFilters(),
  );

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
    this.permissions.set({
      index: this.#userPermission.hasAnyPermissions([
        constants.permissions["index-exported-files"],
      ]),
    });

    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Exports Module"]);

    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: this.translate.instant(_("export_requests")),
      indexIcon: "fas fa-file-export",
      endpoints: { index: "exports/exports-requests" },
      indexApiVersion: "v2",
      indexTableKey: "EXPORT_REQUESTS_KEY",
      columns: [
        {
          title: this.translate.instant(_("id")),
          name: "id",
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("exported_by")),
          name: "created_by",
          render: this.exportBy(),
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("export_type")),
          name: "export_type",
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("creation_time")),
          name: "created_at",
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("execution_time")),
          name: "execution_time",
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("status")),
          name: "status",
          searchable: false,
          orderable: false,
        },
      ],
    };
  }

  refreshExportRequests(filters: Record<string, any>) {
    this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }));
  }
}
