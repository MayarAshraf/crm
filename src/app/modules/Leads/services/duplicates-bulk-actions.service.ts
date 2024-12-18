import { DestroyRef, Injectable, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ImportsInputsService } from "@modules/Imports/services/imports-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, ConfirmService, FieldBuilderService } from "@shared";
import { MenuItem } from "primeng/api";
import { LeadFieldsService } from "./lead-fields.service";
import { Lead } from "./service-types";

@Injectable({ providedIn: "root" })
export class DuplicatesBulkActionsService {
  #confirmService = inject(ConfirmService);
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)
  #leadFields = inject(LeadFieldsService);
  #importsInputs = inject(ImportsInputsService);
  #fieldBuilder = inject(FieldBuilderService);
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
        ];
      default:
        return [];
    }
  }

  // start fields
  getReAssignFields(): FormlyFieldConfig[] {
    return [...this.#importsInputs.getAssignToField(), this.#leadFields.getHideHistoryField()];
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
          keep_me_there: "off",
          hide_history: 0,
          users: null,
          groups: null,
        };
      case "delete":
        return { leads: this.selectedIds() };
    }
  }

  getEndpoint(): string {
    switch (this.selectedAction()?.key) {
      case "re-assign":
        return "leads/bulk-actions/assign-leads";
      case "merge":
        return "";
      case "delete":
        return "leads/bulk-actions/delete-leads";
      default:
        return "";
    }
  }
}
