import { ChangeDetectionStrategy, Component } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { InterestModel } from "@modules/Interests/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { BaseCreateUpdateComponent, DynamicDialogComponent, FormComponent } from "@shared";

@Component({
  selector: "app-interest-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterestCuComponent extends BaseCreateUpdateComponent<InterestModel> {
  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "interests/store",
        update: "interests/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_interest")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new InterestModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_interest")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new InterestModel();
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "interest",
        type: "input-field",
        props: {
          required: true,
          label: _("interest"),
          placeholder: _("interest"),
        },
      },
    ];
  }
}
