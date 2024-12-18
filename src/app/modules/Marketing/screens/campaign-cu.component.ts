import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { CampaignModel } from "@modules/Marketing/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";
import { map } from "rxjs";

@Component({
  selector: "app-campaign-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignCuComponent extends BaseCreateUpdateComponent<CampaignModel> {
  #getlangRepeaterField = inject(LangRepeaterFieldService);
  #cachedLists = inject(CachedListsService);

  isMultiUploading = signal(false);

  ngOnInit() {
    this.isDisabled = computed(() => this.isMultiUploading());

    this.#cachedLists.updateLists([
      "marketing:campaigns_types",
      "marketing:campaigns_statuses",
      "marketing:currencies",
    ]);

    this.dialogMeta = {
      ...this.dialogMeta,
      createApiVersion: "v2",
      updateApiVersion: "v2",
      endpoints: {
        store: "marketing/campaigns/store",
        update: "marketing/campaigns/update",
      },
    };

    if (this.editData && this.editData.id) {
      this.model = { id: this.editData.id, ...new CampaignModel(this.editData) };
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_campaign")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
    } else {
      this.model = new CampaignModel();
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_campaign")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#getlangRepeaterField.getlangRepeaterField([
        {
          key: "campaign_name",
          type: "input-field",
          props: {
            label: _("name"),
          },
        },
        {
          key: "description",
          type: "textarea-field",
          className: "col-12",
          props: {
            label: _("description"),
            rows: 4,
          },
        },
      ]),
      {
        template: `<div class="mt-3"></div>`,
      },
      this.fieldBuilder.fieldBuilder([
        {
          key: "campaign_type_id",
          type: "select-field",
          className: "col-12 md:col-6",
          props: {
            required: true,
            filter: true,
            label: _("type"),
            placeholder: _("type"),
            options: this.#cachedLists
              .getLists()
              .pipe(map(o => o.get(`marketing:campaigns_types`) || [])),
          },
        },
        {
          key: "campaign_status_id",
          type: "select-field",
          className: "col-12 md:col-6",
          props: {
            required: true,
            filter: true,
            label: _("status"),
            placeholder: _("status"),
            options: this.#cachedLists
              .getLists()
              .pipe(map(o => o.get(`marketing:campaigns_statuses`) || [])),
          },
        },
      ]),
      this.fieldBuilder.fieldBuilder(
        [
          {
            key: "expected_revenue",
            type: "input-field",
            className: "input-group-field-lg",
            validation: {
              messages: {
                pattern: (error: any, field: FormlyFieldConfig) =>
                  `"${field.formControl?.value}" seems to be invalid.`,
              },
            },
            props: {
              placeholder: _("expected_revenue"),
              label: _("expected_revenue"),
              required: true,
              pattern: /^[0-9]+(\.[0-9][0-9]?)?$/,
            },
          },
          {
            key: "currency_code",
            type: "select-field",
            className: "input-group-field-sm",
            props: {
              required: true,
              placeholder: _("code"),
              filter: true,
              options: this.#cachedLists
                .getLists()
                .pipe(map(o => o.get(`marketing:currencies`) || [])),
            },
          },
        ],
        "input-group",
      ),
      this.fieldBuilder.fieldBuilder([
        {
          key: "expected_response",
          type: "input-field",
          validation: {
            messages: {
              pattern: (error: any, field: FormlyFieldConfig) =>
                `"${field.formControl?.value}" seems to be invalid.`,
            },
          },
          props: {
            placeholder: _("expected_response"),
            label: _("expected_response"),
            required: true,
            pattern: /^[0-9]+(\.[0-9][0-9]?)?$/,
          },
        },
        {
          key: "budgeted_cost",
          type: "input-field",
          validation: {
            messages: {
              pattern: (error: any, field: FormlyFieldConfig) =>
                `"${field.formControl?.value}" seems to be invalid.`,
            },
          },
          props: {
            placeholder: _("budgeted_cost"),
            label: _("budgeted_cost"),
            required: true,
            pattern: /^[0-9]+(\.[0-9][0-9]?)?$/,
          },
        },
        {
          key: "actual_cost",
          type: "input-field",
          validation: {
            messages: {
              pattern: (error: any, field: FormlyFieldConfig) =>
                `"${field.formControl?.value}" seems to be invalid.`,
            },
          },
          props: {
            label: _("actual_cost"),
            required: true,
            pattern: /^[0-9]+(\.[0-9][0-9]?)?$/,
          },
        },
      ]),
      this.fieldBuilder.fieldBuilder([
        {
          key: "start_date",
          type: "date-field",
          props: {
            label: _("start_date"),
          },
        },
        {
          key: "end_date",
          type: "date-field",
          props: {
            label: _("end_date"),
          },
        },
      ]),
      {
        key: "files_names",
        type: "multi-files-field",
        props: {
          label: _("attachments"),
          mode: this.editData ? "update" : "store",
          isUploading: this.isMultiUploading,
        },
      },
    ];
  }
}
