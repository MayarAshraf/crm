import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FilterCheckInService } from "@modules/HR/services/check-in-filters.service";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  CachedListsService,
  ConfirmService,
  constants,
  CopyButtonComponent,
  DateFormatterPipe,
  EnabledModuleService,
  FilterConfig,
  FiltersPanelComponent,
  PermissioneVisibilityDirective,
  PermissionsService,
  TableWrapperComponent,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { ImageModule } from "primeng/image";
import { TooltipModule } from "primeng/tooltip";
import { filter, tap } from "rxjs";
import { CheckInsDetailsComponent } from "../check-ins-details.component";

@Component({
  selector: "app-check-ins",
  standalone: true,
  imports: [
    TableWrapperComponent,
    PermissioneVisibilityDirective,
    ButtonModule,
    TooltipModule,
    ImageModule,
    CopyButtonComponent,
    FiltersPanelComponent,
    DateFormatterPipe,
    TranslateModule,
  ],
  templateUrl: "./check-ins.component.html",
  styleUrl: "./check-ins.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CheckInsComponent extends BaseIndexComponent<any> {
  #enabledModule = inject(EnabledModuleService);
  #confirmService = inject(ConfirmService);
  #cachedLists = inject(CachedListsService);
  #userPermission = inject(PermissionsService);
  #checkinFilters = inject(FilterCheckInService);

  showBasicFilters = signal(false);
  showAdvancedFilters = signal(false);

  creator = viewChild.required<TemplateRef<any>>("creator");
  createdAt = viewChild.required<TemplateRef<any>>("createdAt");
  operation = viewChild.required<TemplateRef<any>>("operation");
  location = viewChild.required<TemplateRef<any>>("location");
  image = viewChild.required<TemplateRef<any>>("image");

  checkinFilters = computed<FilterConfig[]>(() => this.#checkinFilters.getCheckInFilters());
  filtersPanel = viewChild<FiltersPanelComponent>("filtersPanel");

  isFakeIncidentTypesHidden = this.#checkinFilters.isFakeIncidentTypesHidden;

  mainLists = ["assignments:all_users_info", "hr:operation_types"];
  basicFiltersLists = ["assignments:users", "hr:operation_types"];
  advancedFiltersLists = ["hr:fake_incident_types"];

  cachedLists = computed(() => {
    let lists = [...this.mainLists];
    if (this.showBasicFilters()) {
      lists = [...lists, ...this.basicFiltersLists];
      if (this.showAdvancedFilters()) {
        lists = [...lists, ...this.advancedFiltersLists];
      }
    }
    return lists;
  });

  cachedLists$ = toObservable(this.cachedLists).pipe(
    filter(e => e.length > 0),
    tap(list => this.#cachedLists.updateLists(list)),
  );

  loadCashedLists = toSignal(this.cachedLists$, { initialValue: [] });

  getLabelById(listKey: string, id: number) {
    return this.#cachedLists
      .loadLists()
      .get(listKey)
      ?.find((item: { value: number }) => item.value === id)?.label;
  }

  ngOnInit() {
    const isFakeIncidentTypesHidden = this.filtersPanel()
      ?.chips()
      ?.find(c => c.name === "is_fake_incident")?.value;
    this.isFakeIncidentTypesHidden.set(!isFakeIncidentTypesHidden);

    this.dialogComponent = CheckInsDetailsComponent;
    this.permissions.set({
      index: this.#userPermission.hasAnyPermissions([
        constants.permissions["index-hr-check-ins"],
        constants.permissions["index-hr-fake-incidents"],
      ]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-hr-check-in"]),
    });

    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["HR Module"]);

    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: this.translate.instant(_("check_ins")),
      indexIcon: "fas fa-map-location",
      endpoints: { index: "hr/check-ins/datatable-index", delete: "hr/check-ins/delete" },
      indexTableKey: "CHECK_IN_KEY",
      columns: [
        {
          title: this.translate.instant(_("agent_name")),
          name: "created_by",
          searchable: true,
          orderable: false,
          render: this.creator(),
        },
        {
          title: this.translate.instant(_("created_at")),
          name: "created_at",
          render: this.createdAt(),
          searchable: false,
          orderable: false,
        },
        {
          title: this.translate.instant(_("operation_type")),
          name: "operation_type_id",
          render: this.operation(),
          searchable: true,
          orderable: false,
        },
        {
          title: this.translate.instant(_("location")),
          name: "long",
          searchable: false,
          orderable: false,
          render: this.location(),
        },
        {
          title: this.translate.instant(_("selfie_picture")),
          name: "image",
          searchable: false,
          orderable: false,
          render: this.image(),
        },
      ],
    };
  }

  refreshCheckIn(filters: Record<string, any>) {
    this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }));
  }

  confirmDelete(rowData: any) {
    this.#confirmService.confirmDelete({
      acceptCallback: () => this.deleteRecord(rowData),
    });
  }

  openDialogDetails(model: any) {
    const dialogConfig = { ...this.dialogConfig, data: model };
    this.dialogRef = this.dialogService.open(this.dialogComponent, dialogConfig);
    this.dialogRef?.onClose.pipe(takeUntilDestroyed(this.destroyRef));
  }
}
