import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { injectIsVisible } from "@layout/header/add-new/add-new.component";
import { DynamicListsInputsService } from "@modules/DynamicLists/services/dynamic-lists-inputs.service";
import { ImportsInputsService } from "@modules/Imports/services/imports-inputs.service";
import { InterestsInputsService } from "@modules/Interests/services/interests-inputs.service";
import { LocationsInputsService } from "@modules/Locations/services/locations-inputs.service";
import { MarketingInputsService } from "@modules/Marketing/services/marketing-inputs.service";
import { ITEM_ORGANIZATION } from "@modules/Organizations/services/service-types";
import { PhoneFieldsService } from "@modules/Phones/services/phone-fields.service";
import { AccountFieldsService } from "@modules/SocialAccounts/services/account-fields.service";
import { TagsInputsService } from "@modules/Tags/services/tags-lists-inputs.service";
import { UsersInputsService } from "@modules/Users/services/users-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CacheService,
  CachedListsService,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
  PermissionsService,
  constants,
} from "@shared";
import { TreeNode } from "primeng/api";
import { TreeNodeSelectEvent, TreeNodeUnSelectEvent } from "primeng/tree";
import { distinctUntilChanged, filter, tap } from "rxjs";
import { LeadFieldsService } from "../services/lead-fields.service";
import { LeadListsInputsService } from "../services/lead-lists-inputs.service";
import { LeadsService } from "../services/leads.service";
import { Lead, LeadModel } from "../services/service-types";

interface StructuredFields {
  [key: string]: StructuredFieldObj;
}

interface StructuredFieldObj {
  lead_field: string;
  is_fast_creation_hidden: boolean;
  is_fast_edit_hidden: boolean;
  is_required: boolean;
}

@Component({
  selector: "app-lead-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  providers: [LocationsInputsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadCuComponent extends BaseCreateUpdateComponent<any> {
  #leadsService = inject(LeadsService);
  #importsInputs = inject(ImportsInputsService);
  #leadListsInputs = inject(LeadListsInputsService);
  #fieldBuilder = inject(FieldBuilderService);
  #locationsInputs = inject(LocationsInputsService);
  #interestsInputs = inject(InterestsInputsService);
  #tagsInputs = inject(TagsInputsService);
  #leadFields = inject(LeadFieldsService);
  #usersInputs = inject(UsersInputsService);
  #userPermissions = inject(PermissionsService);
  #marketingInputs = inject(MarketingInputsService);
  #accountFieldsService = inject(AccountFieldsService);
  #phoneFields = inject(PhoneFieldsService);
  #dynamicListsInputs = inject(DynamicListsInputsService);
  #cacheService = inject(CacheService);
  #cachedLists = inject(CachedListsService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  isVisible = injectIsVisible();

  data!: { leadTypeId?: number; type?: string };
  showDialogHeader = true;

  structuredLeadFields$ = this.#cacheService.getData(
    constants.API_ENDPOINTS.structuredLeadFields,
    "get",
  );

  selection = signal<TreeNode[]>([]);

  requiredFields: StructuredFieldObj[] = [];
  hiddenFields: StructuredFieldObj[] = [];

  nodeOptions = signal<TreeNode[]>([]);
  staticNodeOptions = signal<TreeNode[]>([]);

  isMultiUploading = signal(false);

  ngOnInit() {
    this.isDisabled = computed(() => this.isMultiUploading());

    this.staticNodeOptions.set([
      { label: this.translate.instant(_("owner")), data: "owner_id" },
      { label: this.translate.instant(_("social_accounts")), data: "social_accounts" },
      { label: this.translate.instant(_("attachments")), data: "files_names" },
    ]);

    if (!this.editData) {
      this.staticNodeOptions.update(nodes => [
        {
          label: this.translate.instant(_("marketing_details")),
          data: ["campaign_id", "lead_campaign_status_id"],
        },
        ...nodes,
      ]);
    }

    this.nodeOptions.set([
      {
        key: "lead-info-node",
        label: this.translate.instant(_("lead_information")),
        children: [
          { label: this.translate.instant(_("first_name")), data: "first_name" },
          { label: this.translate.instant(_("middle_name")), data: "middle_name" },
          { label: this.translate.instant(_("last_name")), data: "last_name" },
          { label: this.translate.instant(_("salutation")), data: "salutation_id" },
          { label: this.translate.instant(_("suffix")), data: "suffix" },
          { label: this.translate.instant(_("birthdate")), data: "birthdate" },
          { label: this.translate.instant(_("company")), data: "company" },
          { label: this.translate.instant(_("job_title")), data: "title" },
          { label: this.translate.instant(_("description")), data: "description" },
          { label: this.translate.instant(_("national_id")), data: "national_id" },
          { label: this.translate.instant(_("passport_number")), data: "passport_number" },
          { label: this.translate.instant(_("color")), data: "color" },
          { label: this.translate.instant(_("gender")), data: "gender" },
        ],
      },
      {
        key: "locations-node",
        label: this.translate.instant(_("location_information")),
        children: [
          { label: this.translate.instant(_("address")), data: "address" },
          { label: this.translate.instant(_("zip_code")), data: "zip_code" },
        ],
      },
      {
        key: "work-node",
        label: this.translate.instant(_("work_information")),
        children: [
          { label: this.translate.instant(_("organization")), data: "organization_info" },
          { label: this.translate.instant(_("industry")), data: "industry_id" },
          { label: this.translate.instant(_("company_size")), data: "company_size_id" },
          { label: this.translate.instant(_("department")), data: "department_id" },
          { label: this.translate.instant(_("job_role")), data: "job_id" },
        ],
      },
      {
        key: "classification-node",
        label: this.translate.instant(_("classification_information")),
        children: [
          { label: this.translate.instant(_("contact_method")), data: "contact_method_id" },
          { label: this.translate.instant(_("wallet")), data: "wallet_id" },
          { label: this.translate.instant(_("lead_list")), data: "lead_list_id" },
          {
            label: this.translate.instant(_("lead_classification")),
            data: "lead_classification_id",
          },
          { label: this.translate.instant(_("lead_quality")), data: "lead_quality_id" },
          { label: this.translate.instant(_("cold_calls")), data: "is_cold_calls" },
        ],
      },
    ]);

    this.dialogMeta = {
      ...this.dialogMeta,
      dialogData$: this.structuredLeadFields$,
      showDialogHeader: this.showDialogHeader,
      createApiVersion: "v2",
      updateApiVersion: "v2",
      endpoints: {
        store: "leads/leads/store",
        update: "leads/leads/update",
      },
    };

    if (this.editData) {
      this.model = {
        ...new LeadModel(this.editData),
        id: this.editData.id,
        lead_type_id: this.editData.lead_type_id,
        edit_type: 3,
      };

      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_lead")),
        dialogSubtitle: this.editData.full_name,
        submitButtonLabel: this.translate.instant(_("update")),
      };
    } else {
      this.model = {
        ...new LeadModel(),
        lead_type_id: this.data?.leadTypeId,
        creation_type: 3,
      };
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_lead")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
    }

    this.#getStructuredLeadFields();

    this.#updateLists();
  }

  #updateLists() {
    let lists = [
      "assignments:leads_assignments_methods",
      "assignments:assignments_rules",
      "assignments:users",
      "assignments:groups",
      "dynamic_list:statuses",
      "dynamic_list:lead_lists",
      "dynamic_list:lead_classifications",
      "dynamic_list:lead_qualities",
      "dynamic_list:company_sizes",
      "dynamic_list:ratings",
      "leads:types",
      "locations:countries:ids:null",
      "dynamic_list:contact_methods",
      "dynamic_list:salutations",
      "dynamic_list:jobs",
      "dynamic_list:departments",
      "dynamic_list:wallets",
      "dynamic_list:account_types",
      "internationalizations:countries_codes",
      "interests:interests",
      "tags:tags",
      "dynamic_list:sources",
      "marketing:campaigns",
      "marketing:campaign_statuses",
      "dynamic_list:industries",
      "social_accounts:social_account_types",
    ];

    const countryId = this.editData?.country_id;
    const regionId = this.editData?.region_id;
    const cityId = this.editData?.city_id;

    lists.push(`locations:regions:ids:${countryId || this.model.country_id}`);
    regionId && lists.push(`locations:cities:ids:${regionId}`);
    cityId && lists.push(`locations:areas:ids:${cityId}`);
    this.#cachedLists.updateLists(lists);
  }

  #getFields() {
    this.fields = [
      ...this.getInfoFields(),
      ...this.getMoreInfoFields(),
      ...this.getAddressFields(),
      ...this.getWorkFields(),
      ...this.getPhoneRepeater(),
      ...this.getAccountRepeater(),
      ...this.getOtherFields(),
      ...this.getInterestsAndTags(),
      ...this.getClassificationLists(),
      ...this.getCampaignStatusesField(),
      ...this.getAssignmentFields(),
      ...this.getAttachmentsField(),
      this.#toggleLeadfields(),
    ];
  }

  #getStructuredLeadFields() {
    this.structuredLeadFields$
      .pipe(
        tap((fields: StructuredFields) => {
          const structuredFields = Object.values(fields);
          const orgField = structuredFields.find(f => f.lead_field === "organization_id");
          structuredFields.push({
            lead_field: "organization_info",
            is_fast_creation_hidden: orgField?.is_fast_creation_hidden as boolean,
            is_fast_edit_hidden: orgField?.is_fast_edit_hidden as boolean,
            is_required: orgField?.is_required as boolean,
          });

          this.requiredFields = structuredFields.filter(f => f.is_required);

          this.hiddenFields = structuredFields.filter(f => {
            const isHidden = this.editData ? f.is_fast_edit_hidden : f.is_fast_creation_hidden;
            return !f.is_required && isHidden;
          });

          this.nodeOptions.set([...this.#updatedNodes(), ...this.staticNodeOptions()]);
          this.#getFields();
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }

  #updatedNodes(): TreeNode[] {
    const filteredOptions: TreeNode[] = [];

    this.nodeOptions().forEach(node => {
      const filteredChildren: TreeNode[] = [];

      if (node.data && this.#checkHiddenFields(node.data)) {
        filteredOptions.push(node);
      }

      if (node.children && !node.data) {
        node.children.forEach(child => {
          if (this.#checkHiddenFields(child.data)) {
            filteredChildren.push(child);
          }
        });
      }

      const newNode = { ...node, children: filteredChildren };
      filteredChildren.length > 0 && filteredOptions.push(newNode);
    });

    if (this.data?.type === "account") {
      const classificationNode = filteredOptions.find(n => n.key === "classification-node");
      classificationNode?.children?.unshift({
        label: this.translate.instant(_("account_type")),
        data: "account_type_id",
      });
    }

    return filteredOptions;
  }

  #setRequiredValidator(fieldKey: string): boolean {
    return this.requiredFields.some(f => f.lead_field === fieldKey);
  }

  #checkHiddenFields(fieldKey: string): boolean {
    return this.hiddenFields.some(f => f.lead_field === fieldKey);
  }

  #handleNodeSelection(field: FormlyFieldConfig, node: TreeNode, isHide: boolean) {
    const toggleFieldDisplay = (fieldKey: string) => {
      const selectedField = field.parent?.get?.(fieldKey);
      selectedField && (selectedField.hide = isHide);
    };

    if (!node.data && node.children) {
      node.children.forEach(child => toggleFieldDisplay(child.data));
      return;
    }

    const data = Array.isArray(node.data) ? node.data : [node.data];
    data.forEach(key => toggleFieldDisplay(key));
  }

  #toggleLeadfields(): FormlyFieldConfig {
    return {
      type: "tree-field",
      props: {
        withTogglerBtn: true,
        togglerBtnLabel: this.translate.instant(_("add_detail")),
        togglerBtnIcon: "fas fa-plus",
        selection: this.selection,
        options: this.nodeOptions(),
        selectionChange: (field: FormlyFieldConfig, value: TreeNode[]) => {
          this.selection.set(value);
        },
        onNodeSelect: (field: FormlyFieldConfig, event: TreeNodeSelectEvent) => {
          this.#handleNodeSelection(field, event.node, false);
        },
        onNodeUnselect: (field: FormlyFieldConfig, event: TreeNodeUnSelectEvent) => {
          this.#handleNodeSelection(field, event.node, true);
        },
      },
    };
  }

  #handleSeparatorFieldVisibility(fieldKeys: string[], field: FormlyFieldConfig) {
    field.hide = fieldKeys?.every(f => field.parent?.get?.(f).hide);
    return field.options?.fieldChanges?.pipe(
      filter(e => e.type === "hidden" && fieldKeys.includes(e.field.key as string)),
      tap(() => (field.hide = fieldKeys?.every(f => field.parent?.get?.(f).hide))),
    );
  }

  getInfoFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "first_name",
          type: "input-field",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("first_name"),
          },
          hooks: {
            onInit: field => {
              return field.formControl?.valueChanges.pipe(
                distinctUntilChanged(),
                tap(fName => {
                  const fullNameControl = field.form?.get?.("full_name");
                  const middleName = field.model?.middle_name || "";
                  const lastName = field.model?.last_name || "";
                  fullNameControl?.setValue(`${fName} ${middleName} ${lastName}`.trim());
                }),
              );
            },
          },
        },
        {
          key: "middle_name",
          type: "input-field",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("middle_name"),
          },
          hooks: {
            onInit: field => {
              return field.formControl?.valueChanges.pipe(
                distinctUntilChanged(),
                tap(mName => {
                  const fullNameControl = field.form?.get?.("full_name");
                  const firstName = field.model?.first_name || "";
                  const lastName = field.model?.last_name || "";
                  fullNameControl?.setValue(`${firstName} ${mName} ${lastName}`.trim());
                }),
              );
            },
          },
        },
        {
          key: "last_name",
          type: "input-field",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("last_name"),
          },
          hooks: {
            onInit: field => {
              return field.formControl?.valueChanges.pipe(
                distinctUntilChanged(),
                tap(lName => {
                  const fullNameControl = field.form?.get?.("full_name");
                  const firstName = field.model?.first_name || "";
                  const middleName = field.model?.middle_name || "";
                  fullNameControl?.setValue(`${firstName} ${middleName} ${lName}`.trim());
                }),
              );
            },
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        this.#leadListsInputs.salutationSelectField({
          key: "salutation_id",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("salutation"),
            placeholder: _("salutation"),
          },
        }),
        {
          key: "suffix",
          type: "input-field",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("suffix"),
          },
        },
        {
          key: "full_name",
          type: "input-field",
          props: {
            required: true,
            label: _("full_name"),
            placeholder: _("full_name"),
          },
        },
      ]),
    ];
  }

  getMoreInfoFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "birthdate",
          type: "date-field",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("birthdate"),
            maxDate: new Date(),
          },
        },
        {
          key: "company",
          type: "input-field",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("company_name"),
          },
        },
        {
          key: "title",
          type: "input-field",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("job_title"),
          },
        },
      ]),
      {
        key: "description",
        type: "textarea-field",
        expressions: {
          hide: field => this.#checkHiddenFields(field.key as string),
          "props.required": field => this.#setRequiredValidator(field.key as string),
        },
        props: {
          label: _("description"),
        },
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: "national_id",
          type: "input-field",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("national_id"),
          },
        },
        {
          key: "passport_number",
          type: "input-field",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            type: "number",
            label: _("passport_number"),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder(
        [
          {
            key: "color",
            type: "color-field",
            className: "col-fixed w-8rem",
            expressions: {
              hide: field => this.#checkHiddenFields(field.key as string),
              "props.required": field => this.#setRequiredValidator(field.key as string),
            },
            props: {
              label: _("color"),
            },
          },
          {
            key: "gender",
            type: "radio-field",
            className: "col",
            expressions: {
              hide: field => this.#checkHiddenFields(field.key as string),
              "props.required": field => this.#setRequiredValidator(field.key as string),
            },
            props: {
              label: _("gender"),
              options: [
                { value: 1, label: this.translate.instant(_("male")) },
                { value: 2, label: this.translate.instant(_("female")) },
              ],
            },
          },
        ],
        "formgrid grid align-items-start",
      ),
    ];
  }

  getAddressFields(): FormlyFieldConfig[] {
    return [
      {
        type: "separator-field",
        props: {
          title: this.translate.instant("location_information"),
          icon: "fas fa-location-dot",
        },
      },
      {
        key: "address",
        type: "input-field",
        expressions: {
          hide: field => this.#checkHiddenFields(field.key as string),
          required: field => this.#setRequiredValidator(field.key as string),
        },
        props: {
          label: _("address"),
        },
      },
      this.#fieldBuilder.fieldBuilder([
        this.#locationsInputs.getCountryField({
          required: (field: FormlyFieldConfig) => this.#setRequiredValidator(field.key as string),
        }),
        this.#locationsInputs.getRegionField({
          required: (field: FormlyFieldConfig) => this.#setRequiredValidator(field.key as string),
        }),
        this.#locationsInputs.getCityField({
          required: (field: FormlyFieldConfig) => this.#setRequiredValidator(field.key as string),
        }),
        this.#locationsInputs.getAreaField({
          required: (field: FormlyFieldConfig) => this.#setRequiredValidator(field.key as string),
        }),
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "zip_code",
          type: "input-field",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          className: "col-12 md:col-4",
          props: {
            label: _("zip_code"),
          },
        },
      ]),
    ];
  }

  getWorkFields(): FormlyFieldConfig[] {
    return [
      {
        type: "separator-field",
        props: {
          title: this.translate.instant(_("work_information")),
          icon: "fas fa-briefcase",
        },
        hooks: {
          onInit: field => {
            const fieldKeys = [
              "organization_info",
              "industry_id",
              "company_size_id",
              "department_id",
              "job_id",
            ];
            return this.#handleSeparatorFieldVisibility(fieldKeys, field);
          },
        },
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: "organization_info",
          type: "autocomplete-field",
          className: "col-12 md:col-4",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            placeholder: _("organization"),
            entity: ITEM_ORGANIZATION,
            fieldKey: "organization_id",
          },
        },
        {
          key: "organization_id",
        },
        this.#leadListsInputs.industriesSelectField({
          key: "industry_id",
          className: "col-12 md:col-4",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("industry"),
            placeholder: _("industry"),
          },
        }),
        this.#leadListsInputs.companySizesSelectField({
          key: "company_size_id",
          className: "col-12 md:col-4",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("company_size"),
            placeholder: _("company_size"),
          },
        }),
        this.#leadListsInputs.departmentsSelectField({
          key: "department_id",
          className: "col-12 md:col-4",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("department"),
            placeholder: "department",
          },
        }),
        this.#leadListsInputs.jobsSelectField({
          key: "job_id",
          className: "col-12 md:col-4",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("job_role"),
            placeholder: _("job_role"),
          },
        }),
      ]),
    ];
  }

  getInterestsAndTags(): FormlyFieldConfig[] {
    return [
      {
        type: "separator-field",
        props: {
          title: this.translate.instant(_("interests_and_tags")),
          svg: `<svg width="22" viewBox="0 0 24 24"><path fill="currentColor" d="m21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4a2 2 0 0 0-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7m11.77 8.27L13 19.54l-4.27-4.27A2.52 2.52 0 0 1 8 13.5a2.5 2.5 0 0 1 2.5-2.5c.69 0 1.32.28 1.77.74l.73.72l.73-.73c.45-.45 1.08-.73 1.77-.73a2.5 2.5 0 0 1 2.5 2.5c0 .69-.28 1.32-.73 1.77"/></svg>`,
        },
      },
      this.#fieldBuilder.fieldBuilder([
        this.#interestsInputs.interestsSelectField({
          key: "interests",
          className: "col-12 md:col-6",
          props: {
            label: _("interests"),
            multiple: true,
          },
        }),
        this.#tagsInputs.tagsSelectField({
          key: "tags",
          className: "col-12 md:col-6",
          props: {
            label: _("tags"),
            multiple: true,
          },
        }),
      ]),
    ];
  }

  getPhoneRepeater() {
    return [
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
          this.#phoneFields.getCountryCodeField(),
          this.#phoneFields.getPhoneField(),
          this.#phoneFields.getWhatsappField(),
        ]),
      },
    ];
  }

  getOtherFields() {
    return [
      {
        template: `<div class="border-1 border-200 mb-3"></div>`,
      },
      this.#fieldBuilder.fieldBuilder([
        this.#leadListsInputs.statusesSelectField({
          key: "status_id",
          className: "col-12 md:col-4",
          props: {
            required: true,
            label: _("status"),
            placeholder: _("status"),
          },
        }),
        this.#leadListsInputs.sourcesSelectField({
          key: "source_id",
          className: "col-12 md:col-4",
          props: {
            required: true,
            label: _("source"),
            placeholder: _("source"),
          },
        }),
        this.#leadListsInputs.ratingsSelectField({
          key: "rating_id",
          className: "col-12 md:col-4",
          props: {
            required: true,
            label: _("rating"),
            placeholder: _("rating"),
          },
        }),
      ]),
    ];
  }

  getAccountRepeater(): FormlyFieldConfig[] {
    return [
      {
        type: "separator-field",
        props: {
          title: this.translate.instant(_("social_accounts")),
          icon: "fas fa-link",
        },
        hooks: {
          onInit: field => {
            const fieldKeys = ["social_accounts"];
            return this.#handleSeparatorFieldVisibility(fieldKeys, field);
          },
        },
      },
      {
        key: "social_accounts",
        type: "repeat-field",
        resetOnHide: false,
        hide: true,
        props: {
          addBtnText: this.translate.instant(_("add_new_contact_method")),
          disabledRepeater: false,
        },
        fieldArray: this.#fieldBuilder.fieldBuilder([
          this.#accountFieldsService.getAccountTypeField(false),
          this.#accountFieldsService.getSocialAccountField(false),
        ]),
      },
    ];
  }

  getClassificationLists(): FormlyFieldConfig[] {
    return [
      {
        type: "separator-field",
        props: {
          title: this.translate.instant(_("classification_information")),
          icon: "fas fa-th",
        },
        hooks: {
          onInit: field => {
            const fieldKeys = [
              "account_type_id",
              "contact_method_id",
              "wallet_id",
              "lead_list_id",
              "lead_classification_id",
              "lead_quality_id",
              "owner_id",
              "is_cold_calls",
            ];
            return this.#handleSeparatorFieldVisibility(fieldKeys, field);
          },
        },
      },
      this.#fieldBuilder.fieldBuilder([
        this.#dynamicListsInputs.getAccountTypes({
          key: "account_type_id",
          className: "col-12 md:col-4",
          hide: true,
          props: {
            label: _("account_type"),
            placeholder: _("account_type"),
          },
        }),
        this.#leadListsInputs.contactMethodsSelectField({
          key: "contact_method_id",
          className: "col-12 md:col-4",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("contact_method"),
            placeholder: _("contact_method"),
          },
        }),
        this.#leadListsInputs.walletsSelectField({
          key: "wallet_id",
          className: "col-12 md:col-4",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("wallet"),
            placeholder: _("wallet"),
          },
        }),
        this.#leadListsInputs.leadListsSelectField({
          key: "lead_list_id",
          className: "col-12 md:col-4",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("lead_list"),
            placeholder: _("lead_list"),
          },
        }),
        this.#leadListsInputs.leadClassificationsSelectField({
          key: "lead_classification_id",
          className: "col-12 md:col-4",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("lead_classification"),
            placeholder: _("lead_classification"),
          },
        }),
        this.#leadListsInputs.leadQualitiesSelectField({
          key: "lead_quality_id",
          className: "col-12 md:col-4",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
          props: {
            label: _("lead_quality"),
            placeholder: _("lead_quality"),
          },
        }),
        this.#usersInputs.usersSelectField({
          key: "owner_id",
          className: "col-12 md:col-4",
          hide: true,
          props: {
            label: _("owner"),
            placeholder: _("owner"),
          },
        }),
        this.#leadFields.getIsColdCallsField({
          className: "col-12 md:col-4",
          expressions: {
            hide: field => this.#checkHiddenFields(field.key as string),
            "props.required": field => this.#setRequiredValidator(field.key as string),
          },
        }),
      ]),
    ];
  }

  getCampaignStatusesField(): FormlyFieldConfig[] {
    return [
      {
        type: "separator-field",
        props: {
          title: this.translate.instant("marketing_details"),
          icon: "fas fa-bullhorn",
        },
        hooks: {
          onInit: field => {
            const fieldKeys = ["campaign_id", "lead_campaign_status_id"];
            return this.#handleSeparatorFieldVisibility(fieldKeys, field);
          },
        },
      },
      this.#fieldBuilder.fieldBuilder([
        this.#marketingInputs.campaignsSelectField({
          key: "campaign_id",
          hide: true,
          props: {
            label: _("campaign"),
            placeholder: _("campaign"),
          },
        }),
        this.#marketingInputs.leadCampaignStatusesSelectField({
          key: "lead_campaign_status_id",
          hide: true,
          props: {
            label: _("lead_campaign_status"),
            placeholder: _("lead_campaign_status"),
          },
        }),
      ]),
    ];
  }

  getAssignmentFields(): FormlyFieldConfig[] {
    const havePermissionsToAssign = this.#userPermissions.hasAnyPermissions([
      constants.permissions["assign-to-assignment-rule"],
      constants.permissions["assign-to-users"],
      constants.permissions["assign-to-groups"],
    ]);

    return [
      {
        type: "separator-field",
        props: {
          title: this.translate.instant(_("assigned_to")),
          icon: constants.icons.userGroup,
        },
        expressions: {
          hide: () => !havePermissionsToAssign,
        },
      },
      ...this.#importsInputs.getAssignToField(),
      this.#leadFields.getKeepMeThereField(),
    ];
  }

  getAttachmentsField(): FormlyFieldConfig[] {
    return [
      {
        type: "separator-field",
        props: {
          title: this.translate.instant(_("attachments")),
          icon: "fa fa-paperclip",
        },
        hooks: {
          onInit: field => {
            const fieldKeys = ["files_names"];
            return this.#handleSeparatorFieldVisibility(fieldKeys, field);
          },
        },
      },
      {
        key: "files_names",
        type: "multi-files-field",
        hide: true,
        props: {
          mode: this.editData ? "update" : "store",
          isUploading: this.isMultiUploading,
        },
      },
    ];
  }

  protected override updateUi(lead: Lead): void {
    if (this.editData) {
      this.#leadsService.updateLeadInList(lead);
    } else {
      this.#leadsService.leadList.update(leads => [lead, ...leads]);
      this.#leadsService.totalLeads.update(value => value + 1);
      this.#leadsService.leadsFiltered.update(value => value + 1);
      this.isVisible.set(false);
    }
  }
}
