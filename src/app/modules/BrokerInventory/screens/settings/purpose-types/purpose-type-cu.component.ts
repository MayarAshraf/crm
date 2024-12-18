import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { BrokerInventoryInputsService } from "@modules/BrokerInventory/services/broker-inventory-inputs.service";
import { PurposeTypeModel } from "@modules/BrokerInventory/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";

@Component({
  selector: "app-broker-inventory-purpose-type-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurposeTypeCuComponent extends BaseCreateUpdateComponent<PurposeTypeModel> {
  #getlangRepeaterField = inject(LangRepeaterFieldService);
  #brokerInventoryInputs = inject(BrokerInventoryInputsService);
  #cachedLists = inject(CachedListsService);

  ngOnInit() {
    this.#cachedLists.updateLists(["broker_inventory:purposes"]);

    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "broker_inventory/purpose_types/store",
        update: "broker_inventory/purpose_types/update",
      },
    };

    if (this.editData && this.editData.id) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_purpose_type")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new PurposeTypeModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_purpose_type")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new PurposeTypeModel();
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
      this.#brokerInventoryInputs.purposesSelectField({
        key: "bi_purpose_id",
        props: {
          label: _("purpose"),
        },
      }),
      this.#getlangRepeaterField.getlangRepeaterField([
        {
          key: "purpose_type",
          type: "input-field",
          props: {
            required: true,
            label: _("purpose_type"),
          },
        },
      ]),
    ];
  }
}
