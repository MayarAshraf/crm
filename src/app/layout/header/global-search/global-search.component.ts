import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ITEM_BI_UNIT } from "@modules/BrokerInventory/services/service-types";
import { ITEM_TICKET } from "@modules/CustomerService/services/service-types";
import LeadProfileComponent from "@modules/Leads/screens/lead-profile/lead-profile.component";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { ITEM_LEAD } from "@modules/Leads/services/service-types";
import { ITEM_ORGANIZATION } from "@modules/Organizations/services/service-types";
import { NgSelectComponent, NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { CacheService, createDialogConfig, localStorageSignal } from "@shared";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { TooltipModule } from "primeng/tooltip";
import {
  Observable,
  Subject,
  catchError,
  concat,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  switchMap,
  tap,
} from "rxjs";
import { SearchByItemsService } from "./search-by-items.service";

interface SearchItem {
  id: number;
  name: string;
  hint: string;
  class: string;
}

interface RecentItem extends SearchItem {
  icon: string;
  label: string;
  type: string;
  query: string;
  searchBy: string;
}

@Component({
  selector: "app-global-search",
  templateUrl: "./global-search.component.html",
  styleUrls: ["./global-search.component.scss"],
  standalone: true,
  imports: [
    AsyncPipe,
    ButtonModule,
    NgSelectModule,
    DropdownModule,
    TranslateModule,
    TooltipModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchComponent {
  #cacheService = inject(CacheService);
  #leadsService = inject(LeadsService);
  #dialogService = inject(DialogService);
  #searchByItems = inject(SearchByItemsService);

  #dialogRef: DynamicDialogRef | undefined;

  globalSearchRef = viewChild<NgSelectComponent>("globalSearchRef");

  searchFocus() {
    this.globalSearchRef()?.focus();
  }

  searchDialogVisible = model(false);
  withSpecialCloseBtn = model(false);
  closeSearch = output();
  items$!: Observable<SearchItem[]>;
  itemsLoading = signal(false);
  itemsInput$ = new Subject<string>();
  selectedItem = signal<SearchItem | null>(null);

  recentSearches = localStorageSignal<RecentItem[] | null>(null, "recent-searches-key");
  recentQueries = localStorageSignal<RecentItem[] | null>(null, "recent-queries-key");

  searchByItems = this.#searchByItems.searchByItems;
  selectedSearchItem = this.#searchByItems.selectedSearchItem;
  isValidTerm = this.#searchByItems.isValidTerm;
  searchTerm = this.#searchByItems.searchTerm;
  placeholder = this.#searchByItems.placeholder;
  errorMessage = this.#searchByItems.errorMessage;

  ngOnInit() {
    this.loadItems();
  }

  trackByFn(item: SearchItem) {
    return item.id;
  }

  removeSearchItem(id: number) {
    let items = this.recentSearches()?.filter(item => item.id !== id);
    this.recentSearches.set(items as RecentItem[]);
  }

  removeQueryItem(id: number) {
    let items = this.recentQueries()?.filter(item => item.id !== id);
    this.recentQueries.set(items as RecentItem[]);
  }

  setRecentSearches(recentItem: RecentItem) {
    const exists = this.recentSearches()?.some(item => item.id === recentItem.id);
    if (exists) return;

    const findLabelAndType = () => {
      for (const category of this.searchByItems()) {
        for (const item of category.items) {
          if (item.value === this.selectedSearchItem()) {
            return { label: item.label, type: category.label };
          }
        }
      }
      return null;
    };

    recentItem.icon = this.#getRecentItemIcon(recentItem);
    recentItem.type = findLabelAndType()?.type as string;
    recentItem.label = findLabelAndType()?.label as string;
    this.recentSearches.set([recentItem, ...(this.recentSearches() || [])]);
  }

  setRecentQueries(item: RecentItem) {
    const exists = this.recentQueries()?.some(i => i.id === item.id);
    if (exists) return;

    item.query = this.searchTerm() as string;
    item.searchBy = this.selectedSearchItem();
    this.recentQueries.set([item, ...(this.recentQueries() || [])]);
  }

  #getRecentItemIcon(item: RecentItem) {
    switch (item.class) {
      case ITEM_LEAD:
        return "fas fa-filter";
      case ITEM_TICKET:
        return "fas fa-comment-alt";
      case ITEM_ORGANIZATION:
        return "fas fa-city";
      case ITEM_BI_UNIT:
        return "fas fa-building";
      default:
        return "fas fa-search";
    }
  }

  searchByQuery(query: string, searchBy: string) {
    if (!(query && searchBy)) return;
    this.searchTerm.set(query); // this order is matter (update searchTerm before update itemsInput$)
    this.itemsInput$.next(query); // Trigger the typeahead search
    this.globalSearchRef()?.open();
    this.selectedSearchItem.set(searchBy);
  }

  recenetItems = computed(() => {
    const searches = this.recentSearches() as RecentItem[];
    const queries = this.recentQueries() as RecentItem[];
    const maxLength = Math.max(searches?.length, queries?.length);
    const items = [];

    for (let i = 0; i < maxLength; i++) {
      if (i < searches?.length) {
        items.push({ type: "search", data: searches[i] });
      }
      if (i < queries?.length) {
        items.push({ type: "query", data: queries[i] });
      }
    }

    return items as { type: string; data: RecentItem }[];
  });

  loadItems() {
    this.items$ = concat(
      of([]),
      this.itemsInput$.pipe(
        filter(res => !!res && this.isValidTerm()),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.itemsLoading.set(true)),
        switchMap(query => {
          return this.getItems(query).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.itemsLoading.set(false)),
          );
        }),
      ),
    );
  }

  getItems(query: string | null = null): Observable<SearchItem[]> {
    const cacheKey = `global/search_${query}_${this.selectedSearchItem()}`;

    return this.#cacheService.getData(
      "global/search",
      "post",
      { query, search_by: this.selectedSearchItem() },
      undefined,
      undefined,
      "v2",
      cacheKey,
    );
  }

  openDialog(model: any) {
    const dialogConfig = createDialogConfig({ dismissableMask: true, data: model, width: "980px" });

    this.#dialogRef = this.#dialogService.open(LeadProfileComponent, dialogConfig);
  }

  openLeadDialog(leadId: number) {
    const lead$ = this.#leadsService.getLeadDetails(leadId);
    this.openDialog(lead$);
  }

  viewItem(item: SearchItem) {
    if (!item) return;
    this.setRecentSearches(item as RecentItem);
    this.setRecentQueries(item as RecentItem);
    if (item.class === ITEM_LEAD) {
      this.openLeadDialog(item.id);
    }
    this.searchDialogVisible.set(false);
  }

  viewItemInNewTab(item: SearchItem) {
    if (!item) return;
    this.setRecentSearches(item as RecentItem);
    if (item.class === ITEM_LEAD) {
      window.open(`/leads/leadId/${item.id}`, "_blank");
    }
  }
}
