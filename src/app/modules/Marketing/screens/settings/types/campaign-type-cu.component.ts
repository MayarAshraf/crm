import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { CampaignTypeModel } from "@modules/Marketing/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  DynamicDialogComponent,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";

@Component({
  selector: "app-campaign-type-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignTypeCuComponent extends BaseCreateUpdateComponent<CampaignTypeModel> {
  #getlangRepeaterField = inject(LangRepeaterFieldService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "marketing/campaign-types/store",
        update: "marketing/campaign-types/update",
      },
    };

    if (this.editData && this.editData.id) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_type")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new CampaignTypeModel(this.editData) };
    } else {
      this.model = new CampaignTypeModel();
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_type")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "order",
        type: "input-field",
        props: {
          type: "number",
          required: true,
          label: _("order"),
        },
      },
      this.#getlangRepeaterField.getlangRepeaterField([
        {
          key: "campaign_type",
          type: "input-field",
          props: {
            required: true,
            label: _("campaign_type"),
          },
        },
      ]),
    ];
  }
}
