import { ChangeDetectionStrategy, Component } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { typeModel } from "@modules/Resources/services/service-type";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { BaseCreateUpdateComponent, DynamicDialogComponent, FormComponent } from "@shared";

@Component({
  selector: "app-resource-type-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceTypeCuComponent extends BaseCreateUpdateComponent<typeModel> {
  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "resources/resource_types/store",
        update: "resources/resource_types/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_type")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = {
        id: this.editData.id,
        ...new typeModel(this.editData),
      };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_type")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new typeModel();
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
          label: _("order"),
          placeholder: _("order"),
          required: true,
        },
      },
      {
        key: "title",
        type: "input-field",
        props: {
          label: _("name"),
          placeholder: _("enter_type_name"),
          required: true,
        },
      },
    ];
  }
}
