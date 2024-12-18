import { inject, Injectable } from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { CachedListsService } from "@shared";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BrokerInventoryInputsService {
  #cachedLists = inject(CachedListsService);

  purposesSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        placeholder: data?.props?.placeholder ? data?.props?.placeholder : "Purpose",
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get("broker_inventory:purposes") || [])),
      },
    };
  }
  areaUnitsSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        placeholder: data?.props?.placeholder,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get("broker_inventory:area_units") || [])),
      },
    };
  }
}
