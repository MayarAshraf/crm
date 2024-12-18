import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { CasesFiltersService } from "@modules/CustomerService/services/cases-filters.service";
import { CachedListsService, FiltersData, FiltersPanelComponent } from "@shared";
import { filter, tap } from "rxjs";
import { CasesTableComponent } from "../components/cases-table/cases-table.component";

@Component({
  selector: "app-cases",
  standalone: true,
  imports: [FiltersPanelComponent, CasesTableComponent],
  templateUrl: "./cases.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CasesComponent {
  #cachedLists = inject(CachedListsService);
  #casesFilters = inject(CasesFiltersService);

  showBasicFilters = signal(false);
  showAdvancedFilters = signal(false);
  casesFilters = computed(() => this.#casesFilters.getCasesFilters());
  filtersPanel = viewChild<FiltersPanelComponent>("filtersPanel");

  filtersData = signal<FiltersData>({} as FiltersData);

  pipelineId = this.#casesFilters.pipeLineId;

  mainLists = [
    "customer_service:case_types",
    "customer_service:case_priorities",
    "pipelines:ticket_pipelines",
    "pipelines:tickets_pipeline_stages",
    "assignments:all_users_info",
  ];

  basicFiltersLists = [
    "customer_service:case_statuses",
    "assignments:users",
    "customer_service:case_priorities",
    "customer_service:case_types",
    "pipelines:ticket_pipelines",
    "assignments:suspended_creators",
    "interests:interests",
    "tags:tags",
  ];

  advancedFiltersLists = [
    "customer_service:case_origins",
    "assignments:users",
    "customer_service:case_reasons",
  ];

  cachedLists = computed(() => {
    let lists = [...this.mainLists];
    if (this.showBasicFilters()) {
      lists = [...lists, ...this.basicFiltersLists];
      if (this.pipelineId()) {
        lists = [...lists, `pipelines:pipeline_stages:id:${this.pipelineId()}`];
      }
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

  ngOnInit() {
    const pipelineId = this.filtersPanel()
      ?.chips()
      ?.find(c => c.name === "pipeline_id")?.value;
    pipelineId && this.pipelineId.set(pipelineId);
  }

  refreshCases(filters: Record<string, any>) {
    if (filters.leads_ids) {
      const newFilters = {
        ...filters,
        leads_ids: filters.leads_ids.map((i: { value: number }) => i.value),
      };
      this.filtersData.update(oldFilters => ({ ...oldFilters, ...newFilters }));
    } else {
      this.filtersData.update(oldFilters => ({ ...oldFilters, ...filters }));
    }
  }
}
