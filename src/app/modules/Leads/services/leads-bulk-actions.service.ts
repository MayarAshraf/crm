import { DestroyRef, Injectable, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ImportsInputsService } from "@modules/Imports/services/imports-inputs.service";
import { InterestsInputsService } from "@modules/Interests/services/interests-inputs.service";
import { MarketingInputsService } from "@modules/Marketing/services/marketing-inputs.service";
import { NoteInputsService } from "@modules/Notes/services/note-inputs.service";
import { TagsInputsService } from "@modules/Tags/services/tags-lists-inputs.service";
import { TaskFieldsService } from "@modules/Tasks/services/task-fields.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, ConfirmService, FieldBuilderService } from "@shared";
import { MenuItem } from "primeng/api";
import { LeadFieldsService } from "./lead-fields.service";
import { LeadListsInputsService } from "./lead-lists-inputs.service";
import { Lead } from "./service-types";

@Injectable({ providedIn: "root" })
export class LeadsBulkActionsService {
  #confirmService = inject(ConfirmService);
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)
  #leadFields = inject(LeadFieldsService);
  #importsInputs = inject(ImportsInputsService);
  #fieldBuilder = inject(FieldBuilderService);
  #leadListsInputs = inject(LeadListsInputsService);
  #interestsInputs = inject(InterestsInputsService);
  #tagsInputs = inject(TagsInputsService);
  #taskFieldsService = inject(TaskFieldsService);
  #marketingInputs = inject(MarketingInputsService);
  #noteInputs = inject(NoteInputsService);
  #translate = inject(TranslateService);

  selectedAction = signal<MenuItem | null>(null);
  selectedItems = signal<Lead[]>([]);

  selectedIds = computed(() => this.selectedItems()?.map((l: Lead) => l.id));
  model = computed(() => this.getModel());
  fields = computed<FormlyFieldConfig[]>(() => this.getFields());
  endpoint = computed<string>(() => this.getEndpoint());

  getCachedLists() {
    switch (this.selectedAction()?.key) {
      case "re-assign":
        return [
          "assignments:leads_assignments_methods",
          "assignments:assignments_rules",
          "assignments:users",
          "assignments:groups",
          "dynamic_list:statuses",
          "dynamic_list:ratings",
        ];
      case "stage":
        return ["dynamic_list:statuses"];
      case "interests":
        return ["interests:interests"];
      case "tags":
        return ["tags:tags"];
      case "task":
        return ["tasks:types", "assignments:users", "tasks:statuses", "tasks:priorities"];
      case "campaign":
        return ["marketing:campaigns", "marketing:campaign_statuses"];
      case "rating":
        return ["dynamic_list:ratings"];
      case "source":
        return ["dynamic_list:sources"];
      case "wallet":
        return ["dynamic_list:wallets"];
      case "list":
        return ["dynamic_list:lead_lists"];
      case "type":
        return ["leads:types"];
      case "cold-calls":
        return ["leads:leads_calls_type"];
      default:
        return [];
    }
  }

  // start fields
  getTaskFields(): FormlyFieldConfig[] {
    return this.#taskFieldsService.configureFields();
  }

  getReAssignFields(): FormlyFieldConfig[] {
    return [
      ...this.#importsInputs.getAssignToField(),
      this.#leadFields.getKeepMeThereField(),
      this.#leadFields.getHideHistoryField(),
      this.#leadFields.getChangeStageField(),
      this.#leadFields.getLeadStatusField(),
      this.#leadFields.getChangeRatingField(),
      this.#leadFields.getLeadRatingField(),
      this.#leadFields.getMarkOldTodosAsCompletedField(),
    ];
  }

  getStageFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.#leadListsInputs.statusesSelectField({
          key: "status_id",
          className: "col-12 xl:col-3 md:col-4",
          props: {
            required: true,
            label: _("status"),
            placeholder: _("status"),
          },
        }),
      ]),
    ];
  }

  getCampaignFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.#marketingInputs.campaignsSelectField({
          key: "campaign_id",
          className: "col-12 xl:col-4 md:col-6",
          props: {
            required: true,
            label: _("campaign"),
            placeholder: _("campaign"),
          },
        }),
        this.#marketingInputs.leadCampaignStatusesSelectField({
          key: "lead_campaign_status_id",
          className: "col-12 xl:col-4 md:col-6",
          props: {
            required: true,
            label: _("lead_campaign_status"),
            placeholder: _("lead_campaign_status"),
          },
        }),
      ]),
      {
        key: "detach_old_campaigns_if_any",
        type: "boolean-field",
        props: {
          label: _("detach_old_campaigns_if_any"),
          trueValue: 1,
          falseValue: 0,
        },
      },
    ];
  }

  getInterestsFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.#interestsInputs.interestsSelectField({
          key: "interests",
          className: "col-12 xl:col-3 md:col-4",
          props: {
            required: true,
            label: _("interests"),
            multiple: true,
          },
        }),
      ]),
    ];
  }

  getTagsFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.#tagsInputs.tagsSelectField({
          key: "tags",
          className: "col-12 xl:col-3 md:col-4",
          props: {
            required: true,
            label: _("tags"),
            multiple: true,
          },
        }),
      ]),
    ];
  }

  getRatingFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.#leadListsInputs.ratingsSelectField({
          key: "rating_id",
          className: "col-12 xl:col-3 md:col-4",
          props: {
            required: true,
            label: _("rating"),
            placeholder: _("rating"),
          },
        }),
      ]),
    ];
  }

  getSourceFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.#leadListsInputs.sourcesSelectField({
          key: "source_id",
          className: "col-12 xl:col-3 md:col-4",
          props: {
            required: true,
            label: _("source"),
            placeholder: _("source"),
          },
        }),
      ]),
    ];
  }

  getWalletFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.#leadListsInputs.walletsSelectField({
          key: "wallet_id",
          className: "col-12 xl:col-3 md:col-4",
          props: {
            required: true,
            label: _("wallet"),
            placeholder: _("wallet"),
          },
        }),
      ]),
    ];
  }

  getListFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.#leadListsInputs.leadListsSelectField({
          key: "lead_list_id",
          className: "col-12 xl:col-3 md:col-4",
          props: {
            required: true,
            label: _("lead_list"),
            placeholder: _("lead_list"),
          },
        }),
      ]),
    ];
  }

  getTypeFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.#leadListsInputs.leadTypesSelectField({
          className: "col-12 xl:col-3 md:col-4",
          props: {
            required: true,
            label: _("lead_type"),
            placeholder: _("lead_type"),
          },
        }),
      ]),
    ];
  }

  getNoteFields(): FormlyFieldConfig[] {
    return [
      this.#noteInputs.getNoteSubjectField({
        props: { required: true, label: _("subject") },
      }),
      this.#noteInputs.getNoteDescField({
        props: { label: _("description") },
      }),
    ];
  }

  getColdCallsFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.#leadListsInputs.callsFlagSelectField({
          key: "leads_calls_type",
          className: "col-12 xl:col-3 md:col-4",
          props: {
            required: true,
            label: _("change_cold_calls_flag"),
            placeholder: _("change_cold_calls_flag"),
          },
        }),
      ]),
    ];
  }

  getRestoreLeadsFields(): FormlyFieldConfig[] {
    return [
      {
        type: "button-field",
        props: {
          label: _("restore_leads"),
          buttonIcon: "fas fa-undo",
          buttonClass: "p-button-success py-2",
          onClick: () => {
            this.#confirmService.confirmDelete({
              message: this.#translate.instant(
                _("are_you_sure_you_want_to_bulk_restore_leads_selected_leads"),
              ),
              acceptCallback: () =>
                this.#api
                  .request("post", this.endpoint(), this.model())
                  .pipe(takeUntilDestroyed(this.#destroyRef))
                  .subscribe(() => {
                    this.selectedAction.set(null);
                  }),
            });
          },
        },
      },
    ];
  }

  getDeleteFields(): FormlyFieldConfig[] {
    return [
      {
        type: "button-field",
        props: {
          label: _("bulk_delete"),
          buttonIcon: "fas fa-trash",
          buttonClass: "p-button-danger py-2",
          onClick: () => {
            this.#confirmService.confirmDelete({
              message: this.#translate.instant(
                _("are_you_sure_you_want_to_bulk_delete_selected_leads"),
              ),
              acceptCallback: () =>
                this.#api
                  .request("post", this.endpoint(), this.model())
                  .pipe(takeUntilDestroyed(this.#destroyRef))
                  .subscribe(() => {
                    this.selectedAction.set(null);
                  }),
            });
          },
        },
      },
    ];
  }
  // end fields

  getFields(): FormlyFieldConfig[] {
    switch (this.selectedAction()?.key) {
      case "re-assign":
        return this.getReAssignFields();
      case "stage":
        return this.getStageFields();
      case "interests":
        return this.getInterestsFields();
      case "tags":
        return this.getTagsFields();
      case "task":
        return this.getTaskFields();
      case "campaign":
        return this.getCampaignFields();
      case "rating":
        return this.getRatingFields();
      case "source":
        return this.getSourceFields();
      case "wallet":
        return this.getWalletFields();
      case "list":
        return this.getListFields();
      case "type":
        return this.getTypeFields();
      case "note":
        return this.getNoteFields();
      case "cold-calls":
        return this.getColdCallsFields();
      case "restore-leads":
        return this.getRestoreLeadsFields();
      case "delete":
        return this.getDeleteFields();
      default:
        return [];
    }
  }

  getModel() {
    switch (this.selectedAction()?.key) {
      case "re-assign":
        return {
          leads: this.selectedIds(),
          assignment_rule: "users",
          assignment_rule_id: null,
          status_id: null,
          rating_id: null,
          keep_me_there: "off",
          hide_history: 0,
          change_stage: 0,
          change_rating: 0,
          mark_old_todos_as_completed: "off",
          users: null,
          groups: null,
        };
      case "stage":
        return {
          leads: this.selectedIds(),
          status_id: null,
        };
      case "interests":
        return {
          leads: this.selectedIds(),
          interests: null,
        };
      case "tags":
        return {
          leads: this.selectedIds(),
          tags: null,
        };
      case "task":
        return {
          leads: this.selectedIds(),
          type_id: 2,
          due_date: null,
          assignees: null,
          subject: null,
          description: null,
          status_id: 1,
          priority_id: 2,
        };
      case "campaign":
        return {
          leads: this.selectedIds(),
          campaign_id: null,
          lead_campaign_status_id: null,
          detach_old_campaigns_if_any: 0,
        };
      case "rating":
        return {
          leads: this.selectedIds(),
          rating_id: null,
        };
      case "source":
        return {
          leads: this.selectedIds(),
          source_id: null,
        };
      case "wallet":
        return {
          leads: this.selectedIds(),
          wallet_id: null,
        };
      case "list":
        return {
          leads: this.selectedIds(),
          lead_list_id: null,
        };
      case "type":
        return {
          leads: this.selectedIds(),
          lead_type_id: null,
        };
      case "note":
        return {
          leads: this.selectedIds(),
          subject: null,
          description: null,
        };
      case "cold-calls":
        return {
          leads: this.selectedIds(),
          leads_calls_type: null,
        };
      case "restore-leads":
        return { leads: this.selectedIds() };
      case "delete":
        return { leads: this.selectedIds() };
    }
  }

  getEndpoint(): string {
    switch (this.selectedAction()?.key) {
      case "re-assign":
        return "leads/bulk-actions/assign-leads";
      case "stage":
        return "leads/bulk-actions/change-leads-stage";
      case "interests":
        return "leads/bulk-actions/add-interests";
      case "tags":
        return "leads/bulk-actions/add-tags";
      case "task":
        return "leads/bulk-actions/add-tasks";
      case "campaign":
        return "leads/bulk-actions/attach-campaign";
      case "rating":
        return "leads/bulk-actions/change-leads-rating";
      case "source":
        return "leads/bulk-actions/change-leads-source";
      case "wallet":
        return "leads/bulk-actions/change-leads-wallet";
      case "list":
        return "leads/bulk-actions/change-leads-list";
      case "type":
        return "leads/bulk-actions/change-leads-type";
      case "note":
        return "leads/bulk-actions/add-notes";
      case "cold-calls":
        return "leads/bulk-actions/change-leads-cold-calls-flag";
      case "sms":
        return "";
      case "restore-leads":
        return "leads/bulk-actions/restore-trashed-lead";
      case "merge":
        return "";
      case "delete":
        return "leads/bulk-actions/delete-leads";
      default:
        return "";
    }
  }
}
