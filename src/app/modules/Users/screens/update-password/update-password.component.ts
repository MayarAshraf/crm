import { ChangeDetectionStrategy, Component } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { BaseCreateUpdateComponent, FormComponent, constants } from "@shared";

@Component({
  selector: "app-update-password",
  standalone: true,
  template: `
    <div class="p-3">
      <app-form
        [form]="createUpdateForm"
        [model]="model"
        [showResetButton]="true"
        [fields]="fields"
        [buttonLabel]="dialogMeta.submitButtonLabel"
        [submitBtnLoading]="isLoading()"
        (onSubmit)="createUpdateRecord(dialogMeta.endpoints, $event)"
      />
    </div>
  `,
  imports: [FormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePasswordComponent extends BaseCreateUpdateComponent<any> {
  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      submitButtonLabel: this.translate.instant(_("update")),
      endpoints: {
        updatePassword: "users/updatePassword",
      },
    };

    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "old_password",
        type: "password-field",
        props: {
          placeholder: _("password"),
          toggleMask: true,
          required: true,
          minLength: constants.MIN_LENGTH_TEXT_INPUT,
        },
      },
      this.fieldBuilder.fieldBuilder([
        {
          validators: {
            validation: [{ name: "fieldMatch", options: { errorPath: "password_confirmation" } }],
          },
          fieldGroup: [
            this.fieldBuilder.fieldBuilder([
              {
                key: "password",
                type: "password-field",
                props: {
                  placeholder: _("password"),
                  toggleMask: true,
                  required: true,
                  minLength: constants.MIN_LENGTH_TEXT_INPUT,
                },
              },
              {
                key: "password_confirmation",
                type: "password-field",
                props: {
                  placeholder: _("password_confirmation"),
                  toggleMask: true,
                  required: true,
                  minLength: constants.MIN_LENGTH_TEXT_INPUT,
                },
              },
            ]),
          ],
        },
      ]),
    ];
  }
}
