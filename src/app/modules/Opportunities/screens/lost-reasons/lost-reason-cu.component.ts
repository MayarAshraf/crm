import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { LostReasonModel } from "@modules/Opportunities/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  DynamicDialogComponent,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";

@Component({
  selector: "app-lost-reason-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadLostReasonCuComponent extends BaseCreateUpdateComponent<LostReasonModel> {
  #getlangRepeaterField = inject(LangRepeaterFieldService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "opportunities/lost_reasons/store",
        update: "opportunities/lost_reasons/update",
      },
    };

    if (this.editData && this.editData.id) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_lost_reason")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new LostReasonModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_lost_reason")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new LostReasonModel();
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
          key: "name",
          type: "input-field",
          props: {
            required: true,
            label: _("lost_reason"),
          },
        },
      ]),
    ];
  }
}
