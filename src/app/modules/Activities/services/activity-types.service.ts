import { Injectable, inject } from "@angular/core";
import { ApiService } from "@shared";
import { map } from "rxjs";
import { UpdateActivityTypeModel } from "./service-types";

@Injectable({
  providedIn: "root",
})
export class ActivityTypesService {
  #api = inject(ApiService);

  activityTypesTypes() {
    return this.#api
      .request("get", "activities/manage-activities-types")
      .pipe(map(({ data }) => data));
  }

  updateCustomData(model: UpdateActivityTypeModel) {
    return this.#api.request(
      "post",
      "activities/manage-activities-types/update-custom-data",
      model,
    );
  }

  updateOutcomeData(model: UpdateActivityTypeModel) {
    return this.#api.request(
      "post",
      "activities/manage-activities-types/update-outcome-custom-data",
      model,
    );
  }
}
