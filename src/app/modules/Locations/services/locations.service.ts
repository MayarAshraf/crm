import { Injectable, inject } from "@angular/core";
import { ApiService } from "@shared";
import { map } from "rxjs";

@Injectable({ providedIn: "root" })
export class LocationsService {
  #api = inject(ApiService);

  getLocationsBreadcrumb(id: number) {
    return this.#api
      .request("post", "locations/ancestors-for-breadcrumbs", { id })
      .pipe(map(({ data }) => data));
  }
}
