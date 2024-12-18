import { Injectable, inject } from "@angular/core";
import { ApiService } from "@shared";
import { UpdateLeadFieldModel } from "./service-types";

@Injectable({ providedIn: "root" })
export class GetleadFieldTypesService {
  #api = inject(ApiService);

  updateFieldType(model: UpdateLeadFieldModel) {
    return this.#api.request(
      "post",
      "leads/lead-type-fields/update-custom-data",
      model,
      undefined,
      undefined,
      "v2",
    );
  }
}
