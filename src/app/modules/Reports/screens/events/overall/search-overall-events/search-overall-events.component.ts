import { ChangeDetectionStrategy, Component, computed, inject, output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { GroupsInputsService } from "@modules/Groups/services/groups-inputs.service";
import { SearchOverallEventsModel } from "@modules/Reports/Services/service-types";
import { UsersInputsService } from "@modules/Users/services/users-inputs.service";
import { FormlyFormOptions, FormlyModule } from "@ngx-formly/core";
import { FieldBuilderService } from "@shared";

@Component({
  selector: "app-search-overall-events",
  standalone: true,
  imports: [FormlyModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="searchOverAllEventsForm">
      <formly-form
        [model]="SearchOverAllEventsModel"
        [fields]="searchOverAllEventsFields()"
        [form]="searchOverAllEventsForm"
        [options]="searchOverAllEventsOptions"
      />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchOverallEventsComponent {
  #fieldBuilder = inject(FieldBuilderService);
  #groupsInputs = inject(GroupsInputsService);
  #usersInputs = inject(UsersInputsService);

  onFilterChange = output<SearchOverallEventsModel>();
  onResetChange = output<SearchOverallEventsModel>();

  SearchOverAllEventsModel = new SearchOverallEventsModel();
  searchOverAllEventsForm = new FormGroup({});
  searchOverAllEventsOptions: FormlyFormOptions = {};

  searchOverAllEventsFields = computed(() => {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.#groupsInputs.groupsSelectField({
          key: "groups_ids",
          className: "col-4",
          props: {
            label: "Group",
            multiple: true,
          },
        }),
        this.#usersInputs.usersSelectField(
          {
            key: "users_ids",
            className: "col-4",
            props: {
              label: "Users",
              multiple: true,
            },
          },
          true,
        ),
        {
          type: "button-field",
          className: "col-12 md:col-1",
          expressions: {
            "props.disabled": () => !this.#isFormFilled(this.SearchOverAllEventsModel),
          },
          props: {
            type: "button",
            buttonIcon: "fas fa-search",
            buttonClass: "w-full p-button-sm p-button-success field-height",
            onClick: () => {
              this.onFilterChange.emit(this.SearchOverAllEventsModel);
            },
          },
        },
        {
          type: "button-field",
          className: "col-12 md:col-1",
          expressions: {
            "props.disabled": () => !this.#isFormFilled(this.SearchOverAllEventsModel),
          },
          props: {
            type: "button",
            buttonIcon: "fas fa-eraser",
            buttonClass: "w-full p-button-outlined p-button-sm p-button-plain field-height",
            onClick: () => {
              this.searchOverAllEventsOptions.resetModel?.();
              this.onResetChange.emit(this.SearchOverAllEventsModel);
            },
          },
        },
      ]),
    ];
  });

  #isFormFilled(model: SearchOverallEventsModel): boolean {
    return Object.values(model).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== "";
    });
  }
}
