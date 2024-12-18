import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ViewModel } from "@modules/BrokerInventory/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  DynamicDialogComponent,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";

@Component({
  selector: "app-broker-inventory-view-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewCuComponent extends BaseCreateUpdateComponent<ViewModel> {
  #getlangRepeaterField = inject(LangRepeaterFieldService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "broker_inventory/views/store",
        update: "broker_inventory/views/update",
      },
    };

    if (this.editData && this.editData.id) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_view")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new ViewModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_view")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new ViewModel();
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
          key: "view",
          type: "input-field",
          props: {
            required: true,
            label: _("view"),
          },
        },
      ]),
    ];
  }
}
