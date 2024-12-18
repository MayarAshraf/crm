import { inject, Injectable } from '@angular/core';
import { ApiService } from '@shared';
import { map } from 'rxjs';
import { UnitMatchingRequestModel, UpdateUnitConfigModel, UpdateUnitRequestConfigModel } from './service-types';

@Injectable({
  providedIn: 'root',
})
export class UnitSettingsService {
  #api = inject(ApiService);

  getUnitMatchingRequestFields() {
    const url = "broker_inventory/unit_requests/get-unit-request-matching-config";
    return this.#api.request("post", url, {}).pipe(
      map(({ data }) => data)
    );
  };

  updateUnitMatchingRequestFields(model: UnitMatchingRequestModel) {
    return this.#api.request("post", "broker_inventory/unit_requests/update-unit-request-matching-config", model)
  };

  updateUnitConfig(model: UpdateUnitConfigModel) {
    return this.#api.request("post", "broker_inventory/units/config/update-custom-data", model)
  };

  updatetUnitRequestConfig(model: UpdateUnitRequestConfigModel) {
    return this.#api.request("post", "broker_inventory/unit_requests/config/update-custom-data", model)
  };
}