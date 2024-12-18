import { Injectable, inject, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import localForage from "localforage";
import {
  Observable,
  filter,
  finalize,
  forkJoin,
  from,
  map,
  mergeMap,
  of,
  shareReplay,
  switchMap,
  tap,
} from "rxjs";
import { ApiService } from "./api.service";

export interface ListOption {
  label: string;
  value: any;
}

export interface List {
  module: string;
  name: string;
  parent_id?: number | null;
  parent_ids?: number[] | null;
  list?: ListOption[];
}

@Injectable({ providedIn: "root" })
export class CachedListsService {
  // The current implementation caches lists indefinitely without any expiry or validation mechanism. Consider adding a time-to-live (TTL) or a method to invalidate caches when data updates.

  #api = inject(ApiService);

  // A map to keep track of ongoing requests to prevent duplicate calls
  #ongoingRequests = new Map<string, Observable<Map<string, ListOption[]>>>();

  #lists = signal<string[]>([]); // private to this service.
  lists = this.#lists.asReadonly(); // exposed publicly.

  // Observable that triggers when #lists updates and has at least one key
  lists$ = toObservable(this.#lists).pipe(
    filter(lists => lists.length > 0),
    switchMap(() => this.getLists()),
  );

  loadLists = toSignal(this.lists$, { initialValue: new Map() });

  #generateKey(list: List): string {
    const { module, name, parent_ids, parent_id } = list;
    if (parent_ids !== undefined) {
      return `${module}:${name}:ids:${parent_ids?.join(",") ?? "null"}`;
    }

    if (parent_id !== undefined) {
      return `${module}:${name}:id:${parent_id}`;
    }

    return `${module}:${name}`;
  }

  updateLists(listKeys: string[]) {
    const uniqueListKeys = [...new Set(listKeys)];
    this.#lists.update(oldKeys => [...oldKeys, ...uniqueListKeys]);
  }

  #fetchListsFromApi(listKeys: string[]): Observable<Map<string, ListOption[]>> {
    const lists = listKeys.map(key => {
      const [module, name, ...rest] = key.split(":");
      const list: List = { module, name };

      if (rest.length > 0) {
        const [identifier, value] = rest; // ["ids", "1,2,3"] or ["id", "2"]
        if (identifier === "ids") {
          list.parent_ids = value === "null" ? null : value.split(",").map(Number);
        } else if (identifier === "id") {
          list.parent_id = value === "null" ? null : +value;
        }
      }
      return list;
    });

    return this.#api.request("post", "app-helpers/get-app-list", { lists }).pipe(
      tap(({ data }: { data: List[] }) => {
        data.forEach((list: List) => {
          localForage.setItem(this.#generateKey(list), list.list);
        });
      }),
      map(({ data }: { data: List[] }) => {
        const options = new Map<string, ListOption[]>();
        data.forEach((list: List) => {
          options.set(this.#generateKey(list), list.list as ListOption[]);
        });
        return options;
      }),
    );
  }

  getLists(): Observable<Map<string, ListOption[]>> {
    const cacheKey = JSON.stringify(this.lists());
    if (!this.#ongoingRequests.has(cacheKey)) {
      const listsObservable = this.#fetchListsIfNeeded().pipe(
        shareReplay(1),
        finalize(() => this.#ongoingRequests.delete(cacheKey)), // Cleanup after completion
      );
      this.#ongoingRequests.set(cacheKey, listsObservable);
    }
    return this.#ongoingRequests.get(cacheKey) as Observable<Map<string, ListOption[]>>;
  }

  #fetchListsIfNeeded(): Observable<Map<string, ListOption[]>> {
    return forkJoin(
      this.lists().map(
        key =>
          from(localForage.getItem<ListOption[]>(key)).pipe(map(options => ({ options, key }))), // creates an array of Observables
      ),
      // The `forkJoin` operator is used when we have a group of observables and we want to wait for them to complete ( It’s similar to Promise.all() for promises). In this code, `forkJoin` is used to wait for all the localForage.getItem() calls to complete for each list. Each localForage.getItem() returns an Observable, and `forkJoin` waits for all these Observables to complete and then emits the last emitted value from each. Here, it’s used to get all the cached list options at once.
    ).pipe(
      map(results => {
        const cachedOptions = new Map<string, ListOption[]>();
        const missingListKeys: string[] = [];

        results.forEach(({ options, key }) => {
          if (options !== null) {
            cachedOptions.set(key, options);
          } else {
            missingListKeys.push(key);
          }
        });

        if (missingListKeys.length > 0) {
          return this.#fetchListsFromApi(missingListKeys).pipe(
            map(fetchedMap => {
              fetchedMap.forEach((options, key) => cachedOptions.set(key, options)); // add additional options fetched from the API to cachedOptions.
              return cachedOptions;
            }),
          );
        } else {
          return of(cachedOptions);
        }
      }),
      mergeMap(result => result),
      // The `mergeMap` is used to handle the result of the map operation. If missingLists.length > 0, the map operation returns an Observable, and `mergeMap` handles this Observable. If missingLists.length === 0, the map operation returns an Observable directly, and `mergeMap` also handles this Observable.
    );
  }
}
