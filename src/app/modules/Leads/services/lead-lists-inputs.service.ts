import { inject, Injectable } from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { CachedListsService } from "@shared";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LeadListsInputsService {
  #cachedLists = inject(CachedListsService);

  statusesSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
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
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`dynamic_list:statuses`) || [])),
        change(field, event) {
          field.props && !field.props.multiple && event.originalEvent.stopPropagation();
        },
      },
      hooks: data?.hooks,
    };
  }

  leadListsSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data?.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get(`dynamic_list:lead_lists`) || [])),
      },
      hooks: data?.hooks,
    };
  }

  leadClassificationsSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data?.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get(`dynamic_list:lead_classifications`) || [])),
      },
      hooks: data?.hooks,
    };
  }

  leadQualitiesSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data?.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get(`dynamic_list:lead_qualities`) || [])),
      },
      hooks: data?.hooks,
    };
  }

  companySizesSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data?.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get(`dynamic_list:company_sizes`) || [])),
        change(field, event) {
          field.props && !field.props.multiple && event.originalEvent.stopPropagation();
        },
      },
      hooks: data?.hooks,
    };
  }

  ratingsSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
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
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`dynamic_list:ratings`) || [])),
        change(field, event) {
          field.props && !field.props.multiple && event.originalEvent.stopPropagation();
        },
      },
      hooks: data?.hooks,
    };
  }

  leadTypesSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data?.key ?? "lead_type_id",
      type: "select-field",
      className: data?.className,
      expressions: data?.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`leads:types`) || [])),
      },
      hooks: data?.hooks,
    };
  }

  salutationSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data?.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get(`dynamic_list:salutations`) || [])),
      },
      hooks: data?.hooks,
    };
  }

  industriesSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data?.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get(`dynamic_list:industries`) || [])),
      },
      hooks: data?.hooks,
    };
  }

  contactMethodsSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data?.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get(`dynamic_list:contact_methods`) || [])),
      },
      hooks: data?.hooks,
    };
  }

  jobsSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data?.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`dynamic_list:jobs`) || [])),
      },
      hooks: data?.hooks,
    };
  }

  departmentsSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data?.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get(`dynamic_list:departments`) || [])),
      },
      hooks: data?.hooks,
    };
  }

  sourcesSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data?.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`dynamic_list:sources`) || [])),
      },
      hooks: data?.hooks,
    };
  }

  walletsSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data?.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`dynamic_list:wallets`) || [])),
      },
      hooks: data?.hooks,
    };
  }

  callsFlagSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data?.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        labelClass: data?.props?.labelClass,
        placeholder: data?.props?.placeholder,
        tooltip: data?.props?.tooltip,
        styleClass: data?.props?.styleClass,
        dropdownIcon: data?.props?.dropdownIcon,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        showClear: data?.props?.showClear,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`leads:leads_calls_type`) || [])),
      },
      hooks: data?.hooks,
    };
  }
}
