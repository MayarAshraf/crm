import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { CasesFieldsService } from "@modules/CustomerService/services/cases-fields.service";
import { CaseModel } from "@modules/CustomerService/services/service-types";
import { ImportsInputsService } from "@modules/Imports/services/imports-inputs.service";
import { InterestsInputsService } from "@modules/Interests/services/interests-inputs.service";
import { ITEM_LEAD } from "@modules/Leads/services/service-types";
import { PipelinesFieldsService } from "@modules/Pipelines/services/pipeline-lists-inputs.service";
import { TagsInputsService } from "@modules/Tags/services/tags-lists-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FormComponent,
} from "@shared";
@Component({
  selector: "app-case-cu",
  standalone: true,
  imports: [FormComponent, DynamicDialogComponent],
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseCuComponent extends BaseCreateUpdateComponent<CaseModel> {
  #cachedLists = inject(CachedListsService);
  #pipelinesFields = inject(PipelinesFieldsService);
  #caseFields = inject(CasesFieldsService);
  #interestFields = inject(InterestsInputsService);
  #tagFields = inject(TagsInputsService);
  #importsInputs = inject(ImportsInputsService);

  isMultiUploading = signal(false);

  ngOnInit(): void {
    this.isDisabled = computed(() => this.isMultiUploading());

    this.#cachedLists.updateLists([
      "customer_service:case_statuses",
      "customer_service:case_priorities",
      "customer_service:case_types",
      "pipelines:ticket_pipelines",
      "interests:interests",
      "tags:tags",
      "customer_service:case_origins",
      "customer_service:case_reasons",
      "assignments:tickets_assignments_methods",
      "assignments:users",
      "assignments:groups",
    ]);

    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "customer-service/tickets/store",
        update: "customer-service/tickets/update",
      },
      createApiVersion: "v2",
      updateApiVersion: "v2",
    };

    if (this.editData) {
      const pipelineId = this.editData?.pipeline_id;
      pipelineId && this.#cachedLists.updateLists([`pipelines:pipeline_stages:id:${pipelineId}`]);

      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_ticket")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new CaseModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("new_case")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new CaseModel();
    }

    this.fields = this.configureFields();
  }
  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "ticketable_info",
        type: "autocomplete-field",
        props: {
          required: true,
          disabled: this.editData,
          placeholder: _("customer"),
          entity: ITEM_LEAD,
          fieldKey: "ticketable_id",
        },
      },
      {
        key: "ticketable_id",
      },
      this.fieldBuilder.fieldBuilder([
        this.#pipelinesFields.getPipelineField(
          {
            className: "col-12 md:col-6",
            props: {
              required: true,
              label: _("pipeline"),
            },
          },
          "pipelines:ticket_pipelines",
        ),
        this.#pipelinesFields.getPipelineStageField({
          className: "col-12 md:col-6",
          props: {
            required: true,
            label: _("pipeline_statge"),
          },
        }),
      ]),
      {
        key: "subject",
        type: "input-field",
        props: {
          required: true,
          label: _("subject"),
        },
      },
      this.fieldBuilder.fieldBuilder([
        this.#caseFields.CaseTypesSelectField({
          key: "case_type_id",
          props: {
            required: true,
            label: _("type"),
          },
        }),
        this.#caseFields.CasePrioritiesSelectField({
          key: "case_priority_id",
          props: {
            required: true,
            label: _("priority"),
          },
        }),
      ]),
      {
        key: "description",
        type: "textarea-field",
        props: {
          required: true,
          label: _("description"),
          rows: 4,
        },
      },
      this.fieldBuilder.fieldBuilder([
        this.#caseFields.CaseReasonsSelectField({
          key: "case_reason_id",
          props: {
            required: true,
            label: _("reason"),
          },
        }),
        this.#caseFields.CaseOriginsSelectField({
          key: "case_origin_id",
          props: {
            required: true,
            label: _("origin"),
          },
        }),
      ]),
      this.fieldBuilder.fieldBuilder([
        this.#interestFields.interestsSelectField({
          key: "interests",
          className: "col-12 md:col-6",
          props: {
            label: _("interests"),
            multiple: true,
          },
        }),
        this.#tagFields.tagsSelectField({
          key: "tags",
          className: "col-12 md:col-6",
          props: {
            label: _("tags"),
            multiple: true,
          },
        }),
      ]),
      {
        key: "solution",
        type: "textarea-field",
        props: {
          label: _("solution"),
          rows: 4,
        },
      },

      ...this.#importsInputs.getAssignToField({
        optionsListKey: "assignments:tickets_assignments_methods",
      }),
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
