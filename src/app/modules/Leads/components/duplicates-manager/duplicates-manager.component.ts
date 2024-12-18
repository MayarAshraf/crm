import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { DuplicatesBulkActionsService } from "@modules/Leads/services/duplicates-bulk-actions.service";
import { DuplicatesFiltersService } from "@modules/Leads/services/duplicates-filters.service";
import { LccaPermissionsService } from "@modules/Leads/services/lcca-permissions.service";
import { Lead } from "@modules/Leads/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseIndexComponent,
  BulkActionsComponent,
  BulkDialogComponent,
  CachedListsService,
  constants,
  EnabledModuleService,
  FiltersPanelComponent,
  InitialsPipe,
  PermissionsService,
  RandomColorPipe,
  RangePipe,
  StaticDataService,
  TableWrapperComponent,
} from "@shared";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";

@Component({
  selector: "app-duplicates",
  standalone: true,
  imports: [
    TableWrapperComponent,
    TableModule,
    BulkActionsComponent,
    BulkDialogComponent,
    TranslateModule,
    FiltersPanelComponent,
    RangePipe,
    SkeletonModule,
    InitialsPipe,
    RandomColorPipe,
  ],
  templateUrl: "./duplicates-manager.component.html",
  styleUrls: ["./duplicates-manager.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.is-bulk-bar-displayed]": "isBulkBarDisplayed()",
  },
  styles: `
    :host.is-bulk-bar-displayed {
      display: block;
      padding-bottom: 80px;
      transition: padding-bottom 300ms ease-in-out;
    }
  `,
})
export default class DuplicatesComponent extends BaseIndexComponent<any> {
  #filtersService = inject(DuplicatesFiltersService);
  #staticData = inject(StaticDataService);
  bulkActionsService = inject(DuplicatesBulkActionsService);
  #lccaPermissions = inject(LccaPermissionsService);
  #enabledModule = inject(EnabledModuleService);
  #userPermission = inject(PermissionsService);
  #cachedLists = inject(CachedListsService);

  bulkActionsRef = viewChild<BulkActionsComponent>("bulkActionsRef");
  isBulkBarDisplayed = computed(() => this.bulkActionsRef()?.displayBulkActionsBar());

  showBasicFilters = signal(false);
  bulkActions = signal(this.#staticData.duplicatesBulkActions);
  selectedItems = this.bulkActionsService.selectedItems;

  filters = computed(() => this.#filtersService.getFilters());

  refreshData(filters: Record<string, any>) {
    this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }));
  }

  onSelectionChange(value: any[] = []) {
    this.selectedItems.set(value);
  }

  ngOnInit() {
    this.moduleName = this.#enabledModule.hasModule(constants.modulesNames["Leads Module"]);

    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-duplicate-leads"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-duplicate-lead"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-duplicate-lead"]),
    });

    this.#cachedLists.updateLists([
      "dynamic_list:statuses",
      "assignments:users",
      "interests:interests",
      "tags:tags",
      "dynamic_list:sources",
      "dynamic_list:ratings",
    ]);

    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: "leads/leads" },
      indexApiVersion: "v3",
      columns: [
        {
          name: "id",
          searchable: true,
        },
        {
          name: "full_name",
          searchable: true,
        },
        {
          name: "company",
          searchable: true,
        },
        {
          name: "title",
          searchable: true,
        },
      ],
    };
  }

  checkPermission(lead: Lead, name: string) {
    return this.#lccaPermissions.checkPermission(lead?.lead_type_id, name);
  }
}
