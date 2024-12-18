import { inject, Injectable } from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { CachedListsService } from "@shared";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DynamicListsInputsService {
  #cachedLists = inject(CachedListsService);

  // list = [{ module: "dynamic_list", name: "account_types" }];

  getAccountTypes(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get(`dynamic_list:account_types`) || [])),
      },
      hooks: data?.hooks,
    };
  }
}
