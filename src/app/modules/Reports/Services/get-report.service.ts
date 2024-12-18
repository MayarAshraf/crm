import { HttpBackend, HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { catchError, distinctUntilChanged, filter, finalize, map, of, switchMap, tap } from "rxjs";
import { GlobalApiResponse } from "../../../shared/services/global-services/global";

export interface FilterReport {
  slug?: string;
  type?: string;
  subdomain_id?: number;
  charts?: string[];
  users_ids?: number[] | null;
  groups_ids?: number[] | null;
  start_date?: string;
  end_date?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  #httpBackend = inject(HttpBackend);
  #http = new HttpClient(this.#httpBackend);
  isLoading = signal(false);
  
  #filterData = signal<FilterReport>({} as FilterReport); // private to this service.
  filterData = this.#filterData.asReadonly();

  #url = "http://3.87.154.48/api/reports/get-reports";
  dateRange = signal<string[]>([]);

  filterReport(filter: FilterReport) {
    this.#filterData.set(filter);
  }

  updateFilterReport(newfilter: FilterReport) {
    this.#filterData.update(oldFilters => ({ ...oldFilters, ...newfilter }));
  }

  filterData$ = toObservable(this.#filterData).pipe(
    filter(f => Object.keys(f).length > 0),
    distinctUntilChanged(),
    switchMap(filter => {
      return this.#http.post<GlobalApiResponse>(this.#url, filter).pipe(map(({ data }) => data));
    }),
    catchError(() => {
      return of({});
    }),
  );
}
