import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FacilityModel } from "@modules/BrokerInventory/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  DynamicDialogComponent,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";

@Component({
  selector: "app-broker-inventory-facility-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacilityCuComponent extends BaseCreateUpdateComponent<FacilityModel> {
  #getlangRepeaterField = inject(LangRepeaterFieldService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "broker_inventory/facilities/store",
        update: "broker_inventory/facilities/update",
      },
    };

    if (this.editData && this.editData.id) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_facility")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new FacilityModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_facility")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new FacilityModel();
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
          placeholder: _("order"),
        },
      },
      this.#getlangRepeaterField.getlangRepeaterField([
        {
          key: "facility",
          type: "input-field",
          props: {
            required: true,
            label: _("facility"),
            placeholder: _("facility"),
          },
        },
      ]),
    ];
  }
}
