import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ExampleDocsComponent } from "@modules/Imports/components/example-docs/example-docs.component";
import {
  ImportedRecordsTableComponent,
  ImportRecord,
} from "@modules/Imports/components/imported-records-table/imported-records-table.component";
import { ImportsInputsService } from "@modules/Imports/services/imports-inputs.service";
import { ImportLeadsModel } from "@modules/Imports/services/service-types";
import { InterestsInputsService } from "@modules/Interests/services/interests-inputs.service";
import { LeadFieldsService } from "@modules/Leads/services/lead-fields.service";
import { LeadListsInputsService } from "@modules/Leads/services/lead-lists-inputs.service";
import { MarketingInputsService } from "@modules/Marketing/services/marketing-inputs.service";
import { ITEM_ORGANIZATION } from "@modules/Organizations/services/service-types";
import { PhoneFieldsService } from "@modules/Phones/services/phone-fields.service";
import { TagsInputsService } from "@modules/Tags/services/tags-lists-inputs.service";
import { FormlyFieldConfig, FormlyModule } from "@ngx-formly/core";
import { ApiService, CachedListsService, FieldBuilderService, FiltersData } from "@shared";
import { ButtonModule } from "primeng/button";
import { StepsModule } from "primeng/steps";
import { finalize, tap } from "rxjs";
import { ImportFileComponent } from "src/app/shared/components/fields/import-file.component";

@Component({
  selector: "app-import-form",
  standalone: true,
  imports: [
    StepsModule,
    FormlyModule,
    ButtonModule,
    ReactiveFormsModule,
    ImportedRecordsTableComponent,
    ExampleDocsComponent,
  ],
  templateUrl: "./import-form.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportFormComponent {
  #api = inject(ApiService);
  #fieldBuilder = inject(FieldBuilderService);
  #leadListsInputs = inject(LeadListsInputsService);
  #phoneFields = inject(PhoneFieldsService);
  #leadFields = inject(LeadFieldsService);
  #cachedLists = inject(CachedListsService);
  #importsInputs = inject(ImportsInputsService);
  #interestsInputs = inject(InterestsInputsService);
  #tagsInputs = inject(TagsInputsService);
  #marketingInputs = inject(MarketingInputsService);
  #destroyRef = inject(DestroyRef);

  importModel = input.required<string>();
  uploadEndpoint = input.required<string>();
  importEndpoint = input.required<string>();
  docsType = input.required<"units" | "leads">();

  model = new ImportLeadsModel();
  form = new FormGroup({});
  selectFields: FormlyFieldConfig[] = [];
  importFields: FormlyFieldConfig[] = [];

  isLoading = signal(false);
  importId = signal<number | null>(null);
  tabs = signal([{ label: _("Select File") }, { label: _("Import") }]);
  activeIndex = signal(0);
  showExampleDialog = signal(false);
  fileName = signal("");
  filtersData = signal<FiltersData>({} as FiltersData);
  fileType = signal(this.model.file_type);

  isImportTabActive = computed(() => this.activeIndex() === 1);
  downloadUrl = computed(() => {
    const docsType = this.docsType();
    switch (docsType) {
      case "leads":
        return `assets/files/${
          this.fileType() === "8x" ? "8WORXCRM" : "FBLG"
        }-ImportDataTemplate.xlsx`;
      case "units":
        return "assets/files/8WORXCRM-Inventory-ImportDataTemplate.xlsx";
    }
  });
  downloadLabel = computed(() => {
    const docsType = this.docsType();
    switch (docsType) {
      case "leads":
        return `Download ${this.fileType() === "8x" ? "8X" : "FB"} Example Sheet`;
      case "units":
        return "Download Example Sheet";
      default:
        return "";
    }
  });

  ngOnInit() {
    const lists = [
      "imports:import_file_types",
      "assignments:all_users_info",
      "dynamic_list:sources",
      "dynamic_list:statuses",
      "internationalizations:countries_codes",

      "assignments:leads_assignments_methods",
      "assignments:assignments_rules",
      "assignments:users",
      "assignments:groups",
      "interests:interests",
      "tags:tags",

      "marketing:campaigns",
      "marketing:campaign_statuses",
      "reports_scheduler:reports_file_types",
      "leads:types",

      "dynamic_list:lead_lists",
      "dynamic_list:lead_classifications",
      "dynamic_list:lead_qualities",
    ];

    this.#cachedLists.updateLists(lists);

    this.selectFields = [this.#stepOneFields()];
    this.importFields = this.#stepTwoFields();
  }

  #stepOneFields() {
    return this.#fieldBuilder.fieldBuilder([
      this.#importsInputs.getFileTypeField({
        className: "col-12 md:col-3",
        expressions: {
          hide: () => this.docsType() === "units",
        },
        props: {
          required: true,
        },
        hooks: {
          onInit: field => {
            return field.formControl?.valueChanges.pipe(tap(type => this.fileType.set(type)));
          },
        },
      }),
      {
        key: "file",
        type: ImportFileComponent,
        className: "col-12 md:col-3",
      },
    ]);
  }

  #stepTwoFields(): FormlyFieldConfig[] {
    return [
      { key: "import_id" },
      {
        type: "accordion-field",
        fieldGroup: [
          {
            props: {
              header: "Leads Info",
              icon: "fas fa-info-circle",
              selected: true,
            },
            fieldGroup: this.#InfoFields(),
          },
        ],
      },
      {
        type: "accordion-field",
        fieldGroup: [
          {
            props: {
              header: "Assignment & Interests & Tags",
              icon: "fas fa-users",
              selected: true,
            },
            fieldGroup: this.#assignmentInterestsTagsFields(),
          },
        ],
      },
      {
        type: "accordion-field",
        fieldGroup: [
          {
            props: {
              header: "Organization & Campaign Info",
              icon: "fas fa-bullhorn",
              selected: false,
            },
            fieldGroup: this.#orgCampaignFields(),
          },
        ],
      },
      {
        type: "accordion-field",
        fieldGroup: [
          {
            props: {
              header: "More Information",
              icon: "fas fa-list",
              selected: false,
            },
            fieldGroup: this.#moreInfoFields(),
          },
        ],
      },
    ];
  }

  #InfoFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder(
        [
          this.#leadListsInputs.sourcesSelectField({
            key: "source_id",
            className: "col-12 md:col-3",
            props: {
              required: true,
              label: _("source"),
            },
          }),
          this.#leadListsInputs.statusesSelectField({
            key: "status_id",
            className: "col-12 md:col-3",
            props: {
              required: true,
              label: _("status"),
            },
          }),
          this.#phoneFields.getCountryCodesField({
            className: "col-12 md:col-3",
            props: {
              required: true,
            },
          }),
          this.#leadFields.getIsColdCallsField({
            className: "col-12 md:col-3",
          }),
        ],
        "grid formgrid align-items-center",
      ),
    ];
  }

  #assignmentInterestsTagsFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        ...this.#importsInputs.getAssignToField(),
        this.#interestsInputs.interestsSelectField({
          key: "interests_ids",
          className: "col-12 md:col-3",
          props: {
            label: _("interests"),
            multiple: true,
          },
        }),
        this.#tagsInputs.tagsSelectField({
          key: "tags_ids",
          className: "col-12 md:col-3",
          props: {
            label: _("tags"),
            multiple: true,
          },
        }),
      ]),
    ];
  }

  #orgCampaignFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "organization_info",
          type: "autocomplete-field",
          className: "col-12 md:col-3",
          props: {
            placeholder: _("organization"),
            entity: ITEM_ORGANIZATION,
            fieldKey: "organization_id",
          },
        },
        {
          key: "organization_id",
        },
        this.#marketingInputs.campaignsSelectField({
          key: "campaign_id",
          className: "col-12 md:col-3",
          props: {
            label: _("campaign"),
          },
        }),
        this.#marketingInputs.leadCampaignStatusesSelectField({
          key: "lead_campaign_status_id",
          className: "col-12 md:col-3",
          props: {
            label: _("campaign_status"),
          },
        }),
        this.#leadListsInputs.leadTypesSelectField({
          className: "col-12 md:col-3",
          props: {
            required: true,
            label: _("records_type"),
          },
        }),
      ]),
    ];
  }

  #moreInfoFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.#leadListsInputs.leadListsSelectField({
          key: "lead_list_id",
          className: "col-12 md:col-3",
          props: {
            label: _("lead_list"),
          },
        }),
        this.#leadListsInputs.leadClassificationsSelectField({
          key: "lead_classification_id",
          className: "col-12 md:col-3",
          props: {
            label: _("lead_classification"),
          },
        }),
        this.#leadListsInputs.leadQualitiesSelectField({
          key: "lead_quality_id",
          className: "col-12 md:col-3",
          props: {
            label: _("lead_quality"),
          },
        }),
      ]),
    ];
  }

  #updateImportsTable() {
    this.filtersData.update(filters => ({ ...filters }));
  }

  submitFirstStep() {
    this.isLoading.set(true);
    const formData = new FormData();
    formData.append("file", this.model.file as File);
    formData.append("file_type", this.model.file_type);
    this.#api
      .request<FormData, { id: number; original_name: string }>(
        "post",
        this.uploadEndpoint(),
        formData,
      )
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: data => {
          this.activeIndex.set(1);
          this.importId.set(data.id);
          this.fileName.set(data.original_name);
          this.#updateImportsTable();
        },
      });
  }

  submitSecondStep() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }
    this.isLoading.set(true);
    this.#api
      .request<ImportLeadsModel>("post", this.importEndpoint(), {
        ...this.model,
        import_id: this.importId() as number,
      })
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({ next: () => this.#updateImportsTable() });
  }

  onImportClicked(event: ImportRecord) {
    this.importId.set(event.id);
    if (this.isImportTabActive()) {
      this.submitSecondStep();
    } else {
      const fileName = event.file?.split("/").pop() as string;
      this.activeIndex.set(1);
      this.fileName.set(fileName);
    }
  }
}
