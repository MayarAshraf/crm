import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { CaseOriginModel } from "@modules/CustomerService/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  DynamicDialogComponent,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";

@Component({
  selector: "app-customer-service-case-origin-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseOriginCuComponent extends BaseCreateUpdateComponent<CaseOriginModel> {
  #getlangRepeaterField = inject(LangRepeaterFieldService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "customer-service/case-origins/store",
        update: "customer-service/case-origins/update",
      },
    };

    if (this.editData && this.editData.id) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_case_origin")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new CaseOriginModel(this.editData) };
    } else {
      this.model = new CaseOriginModel();
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_case_origin")),
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
          key: "origin",
          type: "input-field",
          props: {
            required: true,
            label: _("origin"),
          },
        },
        {
          key: "description",
          type: "textarea-field",
          className: "col-12",
          props: {
            label: _("description"),
          },
        },
      ]),
    ];
  }
}
