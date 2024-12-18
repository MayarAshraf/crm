import { inject, Injectable } from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { AuthService, CachedListsService } from "@shared";
import { map, Observable, tap } from "rxjs";

interface CustomFormlyFieldConfig extends FormlyFieldConfig {
  key: string; // override type of key
}

@Injectable({
  providedIn: "root",
})
export class UsersInputsService {
  #authService = inject(AuthService);
  #cachedLists = inject(CachedListsService);

  // list = [{ module: "assignments", name: "users" }];

  usersSelectField(data: CustomFormlyFieldConfig, forceSetNullValue = false): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data.expressions,
      resetOnHide: false,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        placeholder: data?.props?.placeholder,
        required: data?.props?.required,
        disabled: data?.props?.disabled,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`assignments:users`) || [])),
        change(field, event) {
          field.props && !field.props.multiple && event.originalEvent.stopPropagation();
        },
      },
      hooks: data.hooks
        ? data.hooks
        : {
            onInit: field => {
              return (field.props?.options as Observable<any[]>).pipe(
                tap(users => {
                  const authUserId = this.#authService.currentUser()?.id;
                  const isUserExist = users?.find(
                    (user: { label: string; value: number }) => user.value === authUserId,
                  );
                  if (!field.model[data.key] && isUserExist && !forceSetNullValue) {
                    field.formControl?.setValue(field.props?.multiple ? [authUserId] : authUserId);
                  }
                }),
              );
            },
          },
    };
  }
}
