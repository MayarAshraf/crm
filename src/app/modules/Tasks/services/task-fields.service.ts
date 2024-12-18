import { inject, Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { UsersInputsService } from "@modules/Users/services/users-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { CachedListsService, FieldBuilderService } from "@shared";
import { distinctUntilChanged, map, startWith, switchMap, tap } from "rxjs";
import { TaskInputsService } from "./task-inputs.service";

@Injectable({ providedIn: "root" })
export class TaskFieldsService {
  #fieldBuilder = inject(FieldBuilderService);
  #usersInputs = inject(UsersInputsService);
  #cachedLists = inject(CachedListsService);
  #taskInputs = inject(TaskInputsService);

  getTypeIdField(): FormlyFieldConfig {
    return {
      key: "type_id",
      type: "select-field",
      props: {
        placeholder: "Type",
        label: _("type"),
        filter: true,
        required: true,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`tasks:types`) || [])),
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
    };
  }

  getSubjectField(): FormlyFieldConfig {
    return {
      key: "subject",
      type: "input-field",
      expressions: {
        hide: "!model.ui_toggler",
      },
      resetOnHide: false,
      props: {
        placeholder: _("subject"),
        label: _("subject"),
        required: true,
      },
      hooks: {
        onInit: field => {
          const typeField = field.form?.get("type_id");

          return typeField?.valueChanges.pipe(
            distinctUntilChanged(),
            startWith(typeField?.value),
            switchMap(value => {
              return this.#cachedLists.getLists().pipe(
                map(o => o.get(`tasks:types`)),
                tap(taskTypesOptions => {
                  const option = taskTypesOptions?.find(
                    (o: { value: string }) => o.value === value,
                  );
                  option && field.formControl?.setValue(option.label);
                }),
              );
            }),
          );
        },
      },
    };
  }

  getStatusIdField(forcShow = false): FormlyFieldConfig {
    return {
      key: "status_id",
      type: "select-field",
      expressions: {
        hide: ({ model }) => (forcShow ? false : !model.ui_toggler),
      },
      resetOnHide: false,
      props: {
        placeholder: _("status"),
        label: _("status"),
        filter: true,
        required: true,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`tasks:statuses`) || [])),
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
    };
  }

  getPriorityIdField(forcShow = false): FormlyFieldConfig {
    return {
      key: "priority_id",
      type: "select-field",
      expressions: {
        hide: ({ model }) => (forcShow ? false : !model.ui_toggler),
      },
      resetOnHide: false,
      props: {
        placeholder: _("priority"),
        label: _("priority"),
        required: true,
        filter: true,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`tasks:priorities`) || [])),
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
    };
  }

  getAssigneesField(): FormlyFieldConfig {
    return this.#usersInputs.usersSelectField({
      key: "assignees",
      props: {
        label: _("assignees"),
        required: true,
        multiple: true,
      },
    });
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.getTypeIdField(),
        {
          key: "due_date",
          type: "date-field",
          props: {
            required: true,
            label: _("due_date"),
            showTime: true,
          },
        },
      ]),
      this.#taskInputs.getDescField(),
      this.getAssigneesField(),
      {
        key: "ui_toggler",
        type: "boolean-field",
        props: {
          label: _("more_details"),
        },
      },
      this.#fieldBuilder.fieldBuilder([
        this.getSubjectField(),
        this.getStatusIdField(),
        this.getPriorityIdField(),
      ]),
    ];
  }
}
