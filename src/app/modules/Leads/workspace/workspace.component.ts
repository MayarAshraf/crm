import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { TranslateModule } from "@ngx-translate/core";
import {
  BulkActionsComponent,
  BulkDialogComponent,
  CachedListsService,
  constants,
  FiltersData,
  FiltersPanelComponent,
  StaticDataService,
} from "@shared";
import { filter, tap } from "rxjs";
import LeadsTableComponent from "../components/leads-table/leads-table.component";
import { LeadsBulkActionsService } from "../services/leads-bulk-actions.service";
import { LeadsFiltersService } from "../services/leads-filters.service";
@Component({
  selector: "app-workspace",
  standalone: true,
  templateUrl: "./workspace.component.html",
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
  imports: [
    TranslateModule,
    FiltersPanelComponent,
    BulkActionsComponent,
    BulkDialogComponent,
    LeadsTableComponent,
  ],
})
export default class WorkspaceComponent {
  #filtersService = inject(LeadsFiltersService);
  #staticData = inject(StaticDataService);
  bulkActionsService = inject(LeadsBulkActionsService);
  #cachedLists = inject(CachedListsService);

  constants = constants;

  bulkActionsRef = viewChild<BulkActionsComponent>("bulkActionsRef");
  isBulkBarDisplayed = computed(() => this.bulkActionsRef()?.displayBulkActionsBar());

  showBasicFilters = signal(false);
  showAdvancedFilters = signal(false);
  bulkActions = signal(this.#staticData.leadsBulkActions);
  selectedItems = this.bulkActionsService.selectedItems;
  filtersData = signal<FiltersData>({} as FiltersData);

  filters = computed(() => this.#filtersService.getFilters());
  filtersPanel = viewChild<FiltersPanelComponent>("filtersPanel");

  countryId = this.#filtersService.countryId;
  regionId = this.#filtersService.regionId;
  cityId = this.#filtersService.cityId;

  workspaceSettings = signal(this.#staticData.workspaceSettings);

  refreshData(filters: Record<string, any>) {
    if (filters.organization_ids) {
      const newFilters = {
        ...filters,
        organization_ids: filters.organization_ids.map((i: { value: number }) => i.value),
      };
      this.filtersData.update(oldFilters => ({ ...oldFilters, ...newFilters }) as FiltersData);
    } else {
      this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }) as FiltersData);
    }
  }

  mainLists = [
    "dynamic_list:statuses",
    "dynamic_list:sources",
    "dynamic_list:ratings",
    "dynamic_list:lead_lists",
    "dynamic_list:lead_qualities",
    "dynamic_list:lead_classifications",
    "assignments:leads_assignments_methods",
    "assignments:assignments_rules",
    "assignments:assignments_rules_types",
    "assignments:users",
    "assignments:all_users_info",
    "assignments:groups",
    "dynamic_list:wallets",
    "interests:interests",
    "tags:tags",
    "activities:activity_outcomes",
    "activities:activity_types_messages",
    "activities:activity_types_meetings",
  ];

  basicFiltersLists = ["interests:interests", "tags:tags"];

  advancedFiltersLists = [
    "dynamic_list:statuses",
    "assignments:groups",
    "dynamic_list:wallets",
    "assignments:users",
    "leads:leads_calls_type",
    "dynamic_list:contact_methods",
    "dynamic_list:lead_lists",
    "dynamic_list:lead_classifications",
    "dynamic_list:lead_qualities",
    "dynamic_list:ratings",
    "marketing:campaigns",
    "internationalizations:countries_codes",
    "locations:countries:ids:null",
    "leads:types",
    "dynamic_list:account_types",
    "dynamic_list:industries",
    "dynamic_list:company_sizes",
    "dynamic_list:jobs",
    "dynamic_list:departments",
    "dynamic_list:salutations",
    "assignments:suspended_creators",
  ];

  cachedLists = computed(() => {
    let lists = [...this.mainLists];
    if (this.showBasicFilters()) {
      lists = [...lists, ...this.basicFiltersLists];
      if (this.showAdvancedFilters()) {
        this.countryId() && (lists = [...lists, `locations:regions:ids:${this.countryId()}`]);
        this.regionId() && (lists = [...lists, `locations:cities:ids:${this.regionId()}`]);
        this.cityId() && (lists = [...lists, `locations:areas:ids:${this.cityId()}`]);
        lists = [...lists, ...this.advancedFiltersLists];
      }
    }

    lists = [...lists, ...this.bulkActionsService.getCachedLists()];

    return lists;
  });

  cachedLists$ = toObservable(this.cachedLists).pipe(
    filter(e => e.length > 0),
    tap(list => this.#cachedLists.updateLists(list)),
  );

  loadCashedLists = toSignal(this.cachedLists$, { initialValue: [] });

  getLocation(location: string) {
    return this.filtersPanel()
      ?.chips()
      ?.find(c => c.name === location)?.value;
  }

  ngOnInit() {
    const countryId = this.getLocation("country_ids");
    const regionId = this.getLocation("region_ids");
    const cityId = this.getLocation("city_ids");
    countryId && this.countryId.set(countryId);
    regionId && this.regionId.set(regionId);
    cityId && this.cityId.set(cityId);
  }
}
