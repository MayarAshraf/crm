import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { DynamicListModel } from "@modules/DynamicLists/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import {
  BaseCreateUpdateComponent,
  DynamicDialogComponent,
  FormComponent,
  LangRepeaterFieldService,
} from "@shared";

@Component({
  selector: "app-dynamic-list-value-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicListValueCuComponent extends BaseCreateUpdateComponent<DynamicListModel> {
  #getlangRepeaterField = inject(LangRepeaterFieldService);
  #translate = inject(TranslateService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "dynamic_lists/dynamic_list_values/store",
        update: "dynamic_lists/dynamic_list_values/update",
      },
    };

    if (this.editData && !(this.editData.method === "create")) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_item")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new DynamicListModel(this.editData) };
    } else if (this.editData && this.editData.method === "create") {
      this.model = new DynamicListModel(this.editData);
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_item")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      { key: "list_id" },
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
          key: "value",
          type: "input-field",
          props: {
            label: _("name"),
          },
        },
      ]),
    ];
  }
}
