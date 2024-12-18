import { inject, Injectable } from "@angular/core";
import { environment } from "@env";
import { map, Observable, shareReplay } from "rxjs";
import { ApiService, RequestHeaders, RequestParams } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class CacheService {
  #api = inject(ApiService);
  #cachedData$: { [key: string]: Observable<any> } = {}; // #cachedData$ is introduced as an object that will store the cached observables. The keys of this object will be the endpoints, and the values will be the corresponding observables.

  getData(
    endpoint: string,
    requestType: "get" | "post" = "post",
    bodyPayload = {},
    headers?: RequestHeaders,
    params?: RequestParams,
    apiVersion = environment.API_VERSION,
    cacheKey?: string,
  ) {
    const key = cacheKey || endpoint;

    if (this.#cachedData$[key]) {
      return this.#cachedData$[key]; // Return cached data if available
    }

    let request$: Observable<any>;

    if (requestType === "get") {
      // GET Request
      request$ = this.#api
        .request("get", endpoint, undefined, headers, params, apiVersion)
        .pipe(map(({ data }) => data));
    } else {
      // POST Request
      request$ = this.#api
        .request("post", endpoint, bodyPayload, headers, params, apiVersion)
        .pipe(map(({ data }) => data));
    }

    this.#cachedData$[key] = request$.pipe(shareReplay(1));

    return this.#cachedData$[key];
  }
}
