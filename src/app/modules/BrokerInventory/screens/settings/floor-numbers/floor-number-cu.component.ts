import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FloorNumberModel } from "@modules/BrokerInventory/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";

@Component({
  selector: "app-broker-inventory-floor-number-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloorNumberCuComponent extends BaseCreateUpdateComponent<FloorNumberModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #getlangRepeaterField = inject(LangRepeaterFieldService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "broker_inventory/floor_numbers/store",
        update: "broker_inventory/floor_numbers/update",
      },
    };

    if (this.editData && this.editData.id) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_floor_number")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new FloorNumberModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_floor_number")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new FloorNumberModel();
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
          },
        },
        {
          key: "count",
          type: "input-field",
          props: {
            type: "number",
            required: true,
            label: _("count"),
          },
        },
      ]),
      this.#getlangRepeaterField.getlangRepeaterField([
        {
          key: "displayed_text",
          type: "input-field",
          props: {
            required: true,
            label: _("floor_number"),
          },
        },
      ]),
    ];
  }
}
