import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import {
  CachedListsService,
  FilterConfig,
  FiltersData,
  FiltersPanelComponent,
  StaticDataService,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { filter, tap } from "rxjs";
import { OpportunitiesTableComponent } from "../components/opportunities-table/opportunities-table.component";
import { FilterOpportunityService } from "../services/opportunity-filters.service";

@Component({
  selector: "app-opportunities",
  standalone: true,
  imports: [TooltipModule, FiltersPanelComponent, ButtonModule, OpportunitiesTableComponent],
  templateUrl: "./opportunities.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OpportunitiesComponent {
  #dealsFilterService = inject(FilterOpportunityService);
  #cachedLists = inject(CachedListsService);
  #staticData = inject(StaticDataService);

  filtersData = signal<FiltersData>({} as FiltersData);
  showBasicFilters = signal(false);
  showAdvancedFilters = signal(false);

  dealSettings = signal(this.#staticData.dealsSettings);
  dealFilters = computed<FilterConfig[]>(() => this.#dealsFilterService.opportunityFilters());

  refreshTodos(filters: Record<string, any>) {
    this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }));
  }

  mainLists = [
    "pipelines:deal_pipelines",
    "interests:interests",
    "tags:tags",
    "pipelines:deal_pipeline_stages",
    "assignments:all_users_info",
  ];

  basicFiltersLists = [
    "pipelines:deal_pipeline_stages",
    "assignments:users",
    "users:groups",
    "dynamic_list:sources",
    "interests:interests",
    "tags:tags",
    "brokers:brokers",
    "opportunities:lost_reason",
  ];

  advancedFiltersLists = ["assignments:users"];

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
}
