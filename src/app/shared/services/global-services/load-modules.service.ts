import { DOCUMENT } from "@angular/common";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, map, of, tap } from "rxjs";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class LoadModulesService {
  #api = inject(ApiService);
  #document = inject(DOCUMENT);
  #router = inject(Router);

  subdomain = this.#document.location.hostname;

  defaultSubdomain = computed<string | null>(() => {
    switch (this.subdomain) {
      case "localhost":
        return "testing.8xcrm.com";
      case "8xcrm.work":
        return "8x.8xcrm.com";
      default:
        return null;
    }
  });

  #enabledModules = signal<string[]>([]); // private to this service.
  enabledModules = this.#enabledModules.asReadonly(); // exposed publicly.

  getEnabledModules() {
    if (!navigator.onLine) return of(null);
    return this.#api
      .request("post", "modules/names", {
        subdomain: this.defaultSubdomain() || this.subdomain,
      })
      .pipe(
        map(({ data }) => data),
        tap(modules => this.#enabledModules.set(modules)),
        catchError(() => {
          this.#router.navigate(["/no-modules"]);
          return of(null);
          // we have called `return of(null)` because we don’t want the application to stop loading because of the error.If we do that, the user will see a blank screen on the browser.This would confuse the user because he would have no idea what is happening behind the scenes.A better approach would be to get hold of the error, let the application load, and display the error to the user.

          // of(null) creates an observable that emits a single value (null), and then completes immediately.

          // we should not re-throw the error because we don't catch the error in the factory function enabledModulesFactory() in the appConfig.

          // return of(null); // Non-critical, continue initialization
          // return throwError(() => err); // Rethrow to stop initialization
        }),
      );
  }
}
