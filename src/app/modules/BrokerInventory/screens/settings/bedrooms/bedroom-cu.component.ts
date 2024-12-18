import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { BedroomModel } from "@modules/BrokerInventory/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";

@Component({
  selector: "app-broker-inventory-bedroom-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BedroomCuComponent extends BaseCreateUpdateComponent<BedroomModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #getlangRepeaterField = inject(LangRepeaterFieldService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "broker_inventory/bedrooms/store",
        update: "broker_inventory/bedrooms/update",
      },
    };

    if (this.editData && this.editData.id) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_bedroom")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new BedroomModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_bedroom")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new BedroomModel();
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "order",
          type: "input-field",
          props: {
            type: "number",
            required: true,
            label: _("order"),
            placeholder: _("order"),
          },
        },
        {
          key: "count",
          type: "input-field",
          props: {
            type: "number",
            required: true,
            label: _("count"),
            placeholder: _("count"),
          },
        },
      ]),
      this.#getlangRepeaterField.getlangRepeaterField([
        {
          key: "displayed_text",
          type: "input-field",
          props: {
            required: true,
            label: _("bedroom"),
            placeholder: _("bedroom"),
          },
        },
      ]),
    ];
  }
}
