import { inject, Injectable } from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { CachedListsService } from "@shared";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GroupsInputsService {
  #cachedLists = inject(CachedListsService);

  groupsSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data.expressions,
      resetOnHide: false,
      hide: data.hide,
      props: {
        label: data?.props?.label ? data?.props?.label : "Groups",
        placeholder: data?.props?.placeholder,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`assignments:groups`) || [])),
        change(field, event) {
          field.props && !field.props.multiple && event.originalEvent.stopPropagation();
        },
      },
    };
  }
}
