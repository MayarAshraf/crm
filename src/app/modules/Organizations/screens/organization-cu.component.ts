import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ImportsInputsService } from "@modules/Imports/services/imports-inputs.service";
import { ITEM_LEAD } from "@modules/Leads/services/service-types";
import { PhoneFieldsService } from "@modules/Phones/services/phone-fields.service";
import { AccountFieldsService } from "@modules/SocialAccounts/services/account-fields.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  constants,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
} from "@shared";
import { ITEM_ORGANIZATION, OrganizationModel } from "../services/service-types";

@Component({
  selector: "app-organization-cu",
  standalone: true,
  imports: [FormComponent, DynamicDialogComponent],
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationCuComponent extends BaseCreateUpdateComponent<any> {
  #cachedLists = inject(CachedListsService);
  #fieldBuilder = inject(FieldBuilderService);
  #phoneFields = inject(PhoneFieldsService);
  #importsInputs = inject(ImportsInputsService);
  #accountFieldsService = inject(AccountFieldsService);

  isSingleUploading = signal(false);
  isMultiUploading = signal(false);

  ngOnInit(): void {
    this.isDisabled = computed(() => this.isSingleUploading() || this.isMultiUploading());

    this.#cachedLists.updateLists([
      "assignments:tickets_assignments_methods",
      "assignments:users",
      "assignments:groups",
      "internationalizations:countries_codes",
      "social_accounts:social_account_types",
    ]);

    this.dialogMeta = {
      ...this.dialogMeta,
      createApiVersion: "v2",
      updateApiVersion: "v2",
      endpoints: {
        store: "organizations/organizations/store",
        update: "organizations/organizations/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant("update_organization"),
        submitButtonLabel: this.translate.instant("update"),
      };
      this.model = { id: this.editData.id, ...new OrganizationModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant("create_organization"),
        submitButtonLabel: this.translate.instant("create"),
      };
      this.model = new OrganizationModel();
    }

    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "parent_info",
        type: "autocomplete-field",
        props: {
          disabled: this.editData,
          placeholder: _("parent_organization"),
          entity: ITEM_ORGANIZATION,
          fieldKey: "parent_id",
        },
      },
      {
        key: "parent_id",
      },
      {
        key: "organization",
        type: "input-field",
        props: {
          required: true,
          label: _("name"),
        },
      },
      {
        key: "description",
        type: "textarea-field",
        props: {
          label: _("description"),
          rows: 4,
        },
      },
      {
        key: "customers_info",
        type: "autocomplete-field",
        props: {
          disabled: this.editData,
          multiple: true,
          placeholder: _("members"),
          entity: ITEM_LEAD,
          fieldKey: "customers_ids",
        },
      },
      {
        key: "customers_ids",
      },
      ...this.#importsInputs.getAssignToField({
        optionsListKey: "assignments:tickets_assignments_methods",
      }),
      {
        key: "ref_no",
        type: "input-field",
        props: {
          label: _("ref_no"),
        },
      },
      {
        type: "separator-field",
        props: {
          title: this.translate.instant(_("phone_numbers")),
          icon: constants.icons.call,
        },
      },
      {
        key: "phones",
        type: "repeat-field",
        props: {
          addBtnText: this.translate.instant(_("add_new_phone")),
          disabledRepeater: false,
        },
        fieldArray: this.#fieldBuilder.fieldBuilder([
          this.#phoneFields.getCountryCodeField("dialog", {
            props: { required: false },
          }),
          this.#phoneFields.getPhoneField("dialog", {
            props: { required: false },
          }),
          this.#phoneFields.getWhatsappField(),
        ]),
      },
      {
        type: "separator-field",
        props: {
          title: this.translate.instant(_("social_accounts")),
          icon: "fas fa-link",
        },
      },
      {
        key: "social_accounts",
        type: "repeat-field",
        props: {
          addBtnText: this.translate.instant(_("add_new_contact_method")),
          disabledRepeater: false,
        },
        fieldArray: this.#fieldBuilder.fieldBuilder([
          this.#accountFieldsService.getAccountTypeField(false),
          this.#accountFieldsService.getSocialAccountField(false),
        ]),
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
      {
        key: "files_names",
        type: "multi-files-field",
        props: {
          label: _("attachments"),
          mode: this.editData ? "update" : "store",
          isUploading: this.isMultiUploading,
        },
      },
    ];
  }
}
