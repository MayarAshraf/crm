import { inject, Injectable } from '@angular/core';
import { ApiService } from '@shared';
import { map } from 'rxjs/operators';
import { ModulesSettings } from './service-types';

@Injectable({ providedIn: 'root' })

export class ModulesSettingsService {
  #api = inject(ApiService);

  getModulesSettings() {
    return this.#api.request("get", "settings/getSettings").pipe(
      map(({ data }) => data)
    );
  }

  updateKeys(model: ModulesSettings) {
    return this.#api.request("post", "settings/updateKeys", model).pipe(
      map(({ data }) => data)
    );
  }
}