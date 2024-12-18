import { Injectable, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { CacheService, constants } from "@shared";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AutomationInputsService {
  #cacheService = inject(CacheService);

  conditionsSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      hide: data.hide,
      expressions: data.expressions,
      className: data?.className,
      props: {
        label: _("condition"),
        placeholder: _("select_condition"),
        required: true,
        filter: true,
        multiple: false,
        options: this.#cacheService
          .getData(constants.API_ENDPOINTS.getRuleLists)
          .pipe(map(data => data.conditions)),
      },
      hooks: data.hooks,
    };
  }

  actionsSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      hide: data.hide,
      expressions: data.expressions,
      className: data?.className,
      props: {
        label: _("actions"),
        placeholder: _("select_action"),
        required: true,
        filter: true,
        multiple: false,
        options: this.#cacheService
          .getData(constants.API_ENDPOINTS.getRuleLists)
          .pipe(map(data => data.actions)),
      },
      hooks: data.hooks,
    };
  }
}
