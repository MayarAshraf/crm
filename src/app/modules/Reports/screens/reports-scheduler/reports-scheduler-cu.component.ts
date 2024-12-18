import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { UsersInputsService } from "@modules/Users/services/users-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
} from "@shared";
import { distinctUntilChanged, map, tap } from "rxjs";

@Component({
  selector: "reports-scheduler-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsSchedulerCuComponent extends BaseCreateUpdateComponent<any> {
  #cachedLists = inject(CachedListsService);
  #usersInputs = inject(UsersInputsService);
  #fieldBuilder = inject(FieldBuilderService);

  ngOnInit() {
    this.#cachedLists.updateLists([
      "reports_scheduler:reports",
      "assignments:users",
      "reports_scheduler:reports_repeat_types",
      "reports_scheduler:reports_file_types",
    ]);

    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "reports-scheduler/store",
        update: "reports-scheduler/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: "Update Report Scheduler",
        submitButtonLabel: `Update`,
      };
      this.model = this.editData;
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: "Create Report Scheduler",
        submitButtonLabel: `Create`,
      };
      this.model = {
        additional_recipients: null,
        ends_at: null,
      };
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "report_id",
        type: "select-field",
        props: {
          required: true,
          label: "Report",
          placeholder: "Select Report",
          filter: true,
          options: this.#cachedLists
            .getLists()
            .pipe(map(o => o.get(`reports_scheduler:reports`) || [])),
        },
      },
      {
        key: "file_type",
        type: "select-field",
        defaultValue: "xlsx",
        props: {
          required: true,
          label: "Send Report As",
          placeholder: "Send Report As",
          filter: true,
          options: this.#cachedLists
            .getLists()
            .pipe(map(o => o.get(`reports_scheduler:reports_file_types`) || [])),
        },
      },
      this.#usersInputs.usersSelectField({
        key: "recipients_ids",
        props: {
          required: true,
          label: "Recipients",
          placeholder: "Select Recipients",
          multiple: true,
        },
      }),
      {
        key: "additional_recipients",
        type: "input-field",
        props: {
          label: "Additional Recipients",
          description: "Use Commas to Separate E-mail Addresses",
        },
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: "start_date",
          type: "date-field",
          props: {
            required: true,
            label: "Start Date",
          },
        },
        {
          key: "repeat_type",
          type: "select-field",
          defaultValue: "monthly",
          props: {
            label: "Repeat Type",
            placeholder: "Select Repeat Type",
            required: true,
            filter: true,
            options: this.#cachedLists
              .getLists()
              .pipe(map(o => o.get(`reports_scheduler:reports_repeat_types`) || [])),
          },
        },
      ]),
      {
        key: "repeat_ends",
        type: "select-field",
        defaultValue: "never",
        props: {
          label: "Repeat Ends",
          placeholder: "Select Repeat Ends",
          required: true,
          filter: true,
          options: [
            { value: "never", label: "Never" },
            { value: "after", label: "After" },
            { value: "on_date", label: "On" },
          ],
        },
        hooks: {
          onInit: field => {
            return field.formControl?.valueChanges.pipe(
              distinctUntilChanged(),
              tap(value => {
                const fieldGroups = this.fields;

                const fieldsMap = {
                  ends_at: fieldGroups?.find(f => f?.key === "ends_at"),
                  ends_after: fieldGroups?.find(f => f?.key === "ends_after"),
                };

                if (fieldsMap.ends_at && fieldsMap.ends_after) {
                  fieldsMap.ends_after.hide = value !== "after" && value !== "never";
                  fieldsMap.ends_at.hide = value !== "on_date" && value !== "never";
                }
              }),
            );
          },
        },
      },
      {
        key: "ends_after",
        type: "input-field",
        hide: true,
        defaultValue: 2,
        props: {
          type: "number",
          label: "Times",
        },
      },
      {
        key: "ends_at",
        type: "date-field",
        hide: true,
        props: {
          required: true,
          label: "End on date",
        },
      },
      {
        key: "is_active",
        type: "switch-field",
        defaultValue: 1,
        props: {
          label: "Enabled",
        },
      },
    ];
  }
}
