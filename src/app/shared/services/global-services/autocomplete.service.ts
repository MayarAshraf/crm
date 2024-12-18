import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: "root" })
export class AutocompleteService {
  #api = inject(ApiService);

  search(entity: string, needle: string) {
    return this.#api.request(
      "post",
      "global/autocomplete",
      {
        entity,
        needle,
      },
      undefined,
      undefined,
      "v2",
    );
  }
}
