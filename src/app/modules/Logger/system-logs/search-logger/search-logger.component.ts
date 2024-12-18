import { ChangeDetectionStrategy, Component, inject, model } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { GroupsInputsService } from "@modules/Groups/services/groups-inputs.service";
import { UsersInputsService } from "@modules/Users/services/users-inputs.service";
import { FormlyFormOptions, FormlyModule } from "@ngx-formly/core";
import { CachedListsService, FieldBuilderService, FiltersData } from "@shared";
import { map } from "rxjs";

@Component({
  selector: "app-search-logger",
  standalone: true,
  imports: [FormlyModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <formly-form [model]="model" [fields]="fields" [form]="form" [options]="options" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchLoggerComponent {
  #cachedLists = inject(CachedListsService);
  #fieldBuilder = inject(FieldBuilderService);
  #groupsInputs = inject(GroupsInputsService);
  #usersInputs = inject(UsersInputsService);

  filtersData = model<FiltersData>({} as FiltersData);

  model = {};
  form = new FormGroup({});
  options: FormlyFormOptions = {};

  fields = [
    this.#fieldBuilder.fieldBuilder([
      {
        key: "daterange",
        className: "col-12 md:col-2",
        type: "date-field",
        props: {
          label: _("date_range"),
          selectionMode: "range",
        },
      },
      {
        key: "subject_id",
        className: "col-12 md:col-2",
        type: "input-field",
        props: {
          label: _("subject_id"),
        },
      },
      {
        key: "types",
        className: "col-12 md:col-2",
        type: "select-field",
        props: {
          label: _("log_type"),
          multiple: true,
          showHeader: true,
          filter: true,
          options: this.#cachedLists
            .getLists()
            .pipe(map(o => o.get("system_logs:activity_log_types") || [])),
        },
      },
      this.#groupsInputs.groupsSelectField({
        key: "groups",
        className: "col-12 md:col-2",
        props: {
          label: _("group"),
          multiple: true,
        },
      }),
      this.#usersInputs.usersSelectField(
        {
          key: "users",
          className: "col-12 md:col-2",
          props: {
            label: _("creator"),
            multiple: true,
          },
        },
        true,
      ),
      {
        type: "button-field",
        className: "col-12 md:col-1",
        props: {
          type: "button",
          buttonIcon: "fas fa-search",
          buttonClass: "w-full p-button-sm p-button-success field-height",
          onClick: () => {
            if (Object.keys(this.model).length === 0) return;
            this.filtersData.update(filters => ({ ...filters, ...this.model }));
          },
        },
      },
      {
        type: "button-field",
        className: "col-12 md:col-1",
        props: {
          type: "button",
          buttonIcon: "fas fa-eraser",
          buttonClass: "w-full p-button-outlined p-button-sm p-button-plain field-height",
          onClick: () => {
            const modelKeys = Object.keys(this.model);
            if (modelKeys.length === 0) return;
            this.options.resetModel?.();
            this.filtersData.update(oldFilters => {
              const updatedFilters = { ...oldFilters };
              modelKeys.forEach(key => delete updatedFilters[key]);
              return updatedFilters;
            });
          },
        },
      },
    ]),
  ];
}
