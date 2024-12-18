import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { OrganizationsFiltersService } from "@modules/Organizations/services/organizations-filters.service";
import { Organization } from "@modules/Organizations/services/service-types";
import {
  BaseIndexComponent,
  CachedLabelsService,
  CachedListsService,
  CommaSeparatedLabelsComponent,
  constants,
  DateFormatterPipe,
  EnabledModuleService,
  FilterConfig,
  FiltersPanelComponent,
  PermissionsService,
  RangePipe,
  TableCardComponent,
  TableWrapperComponent,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";
import { filter, tap } from "rxjs";
import { OrganizationCuComponent } from "../organization-cu.component";
import { OrganizationViewDialogComponent } from "../organization-view-dialog/organization-view-dialog.component";

@Component({
  selector: "app-organizations",
  standalone: true,
  imports: [
    ButtonModule,
    FiltersPanelComponent,
    TableWrapperComponent,
    CommaSeparatedLabelsComponent,
    SkeletonModule,
    DateFormatterPipe,
    TableCardComponent,
    RangePipe,
  ],
  templateUrl: "./organizations.component.html",
  styleUrl: "./organizations.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrganizationsComponent extends BaseIndexComponent<
  Organization,
  ComponentType<OrganizationCuComponent>
> {
  #enabledModule = inject(EnabledModuleService);
  #cachedLists = inject(CachedListsService);
  #userPermission = inject(PermissionsService);
  #organizationsFilters = inject(OrganizationsFiltersService);
  #cachedLabels = inject(CachedLabelsService);

  showBasicFilters = signal(false);
  showAdvancedFilters = signal(true);

  organizationsFilters = computed<FilterConfig[]>(() =>
    this.#organizationsFilters.getOrganizationsFilters(),
  );

  getLabelsByIds(listKey: string, ids: number[]) {
    return this.#cachedLabels.getLabelsByIds(listKey, ids);
  }

  getLabelById(listKey: string, id: number) {
    return this.#cachedLabels.getLabelById(listKey, id);
  }

  mainLists = ["assignments:all_users_info"];

  basicFiltersLists = ["organizations:organizations_types", "assignments:users"];

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
    this.isListLayout.set(false);
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-organizations"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-organization"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-organization"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-organization"]),
      view: this.#userPermission.hasPermission(constants.permissions["view-organization-details"]),
    });

    this.dialogConfig = { ...this.dialogConfig, width: "650px" };

    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Organizations Module"]);

    this.dialogComponent = OrganizationCuComponent;

    this.indexMeta = {
      ...this.indexMeta,
      rows: 30,
      indexTitle: this.translate.instant(_("organizations")),
      indexIcon: "fas fa-city",
      createBtnLabel: this.translate.instant(_("create_organization")),
      endpoints: {
        index: "organizations/organizations/index",
        delete: "organizations/organizations/delete",
      },
      indexApiVersion: "v2",
      deleteApiVersion: "v2",
      indexTableKey: "ORGANIZATIONS_KEY",
      columns: [
        {
          name: "id",
          searchable: true,
        },
        {
          name: "organization",
          searchable: true,
        },
        {
          name: "description",
          searchable: false,
        },
        {
          name: "assignees_ids",
          searchable: false,
        },
        {
          name: "created_at",
          searchable: false,
        },
        {
          name: "created_by",
          searchable: false,
        },
      ],
    };
  }

  refreshOrganizations(filters: Record<string, any>) {
    this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }));
  }

  openOrganizationView(organization: Organization) {
    const dialogConfig = {
      ...this.dialogConfig,
      dismissableMask: true,
      width: "1200px",
      data: {
        record: organization,
        deleteRecord: this.deleteRecord.bind(this),
        updateRecord: this.openUpdateRecordDialog.bind(this),
      },
    };
    this.dialogRef = this.dialogService.open(OrganizationViewDialogComponent, dialogConfig);
    this.dialogRef?.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(record => {
      this.updateRecord(record);
    });
  }
}
