import { ChangeDetectionStrategy, Component, computed, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { CompanyModel } from "@modules/Companies/service/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { BaseCreateUpdateComponent, DynamicDialogComponent, FormComponent } from "@shared";

@Component({
  selector: "app-company-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyCuComponent extends BaseCreateUpdateComponent<CompanyModel> {
  isSingleUploading = signal(false);

  ngOnInit() {
    this.isDisabled = computed(() => this.isSingleUploading());

    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "companies/store",
        update: "companies/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_company")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new CompanyModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_company")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new CompanyModel();
    }

    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "company_name",
        type: "input-field",
        props: {
          label: _("company_name"),
          required: true,
        },
      },
      {
        key: "mobile_number",
        type: "input-field",
        props: {
          type: "number",
          label: _("mobile_number"),
          required: true,
        },
      },
      {
        key: "whatsapp_number",
        type: "input-field",
        props: {
          type: "number",
          label: _("whatsapp_number"),
          required: true,
        },
      },
      {
        key: "hotline",
        type: "input-field",
        props: {
          type: "number",
          label: _("hotline"),
          required: true,
        },
      },
      {
        key: "email",
        type: "input-field",
        props: {
          label: _("company_email"),
          required: true,
        },
      },
      {
        key: "website",
        type: "input-field",
        props: {
          label: _("website"),
          required: true,
        },
      },
      {
        key: "facebook",
        type: "input-field",
        props: {
          label: _("facebook"),
          required: true,
        },
      },
      {
        key: "twitter",
        type: "input-field",
        props: {
          label: _("twitter"),
          required: true,
        },
      },
      {
        key: "instagram",
        type: "input-field",
        props: {
          label: _("instagram"),
          required: true,
        },
      },
      {
        key: "linkedin",
        type: "input-field",
        props: {
          label: _("linkedin"),
          required: true,
        },
      },
      {
        key: "logo",
        type: "file-field",
        props: {
          label: _("logo"),
          mode: this.editData ? "update" : "store",
          isUploading: this.isSingleUploading,
        },
      },
    ];
  }
}
