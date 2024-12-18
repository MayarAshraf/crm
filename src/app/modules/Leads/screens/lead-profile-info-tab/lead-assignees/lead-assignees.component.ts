import { ChangeDetectionStrategy, Component, computed, inject, input, model } from "@angular/core";
import { ImportsInputsService } from "@modules/Imports/services/imports-inputs.service";
import { LeadFieldsService } from "@modules/Leads/services/lead-fields.service";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { Lead } from "@modules/Leads/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  AvatarListComponent,
  CachedListsService,
  ListOption,
  PermissionsService,
  PopupFormComponent,
  constants,
} from "@shared";

@Component({
  selector: "app-lead-assignees",
  standalone: true,
  template: `
    @if (withItemLable()) {
      <span class="item-label">{{ "assignees" | translate }}</span>
    }

    @if (havePermissionsToAssign) {
      <app-popup-form
        [fields]="fields()"
        [model]="model()"
        [endpoint]="constants.API_ENDPOINTS.updateAssignment"
        apiVersion="v2"
        [payload]="getPayload()"
        [btnIcon]="constants.icons.pencil + ' text-xs'"
        iconPos="right"
        [btnStyleClass]="btnStyleClass()"
        [btnTooltip]="'reassigned' | translate"
        [isEditHovered]="false"
        (updateUi)="updateUi($event)"
      >
        <span topForm class="block text-primary text-xs font-medium mb-3">
          {{ "reassigned" | translate }}
        </span>
        @if (assignees().length && withAvatars()) {
          <app-avatar-list [items]="assignees()" />
        }
      </app-popup-form>
    } @else {
      <app-avatar-list [items]="assignees()" />
    }
  `,
  imports: [PopupFormComponent, AvatarListComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadAssigneesComponent {
  #leadsService = inject(LeadsService);
  #leadFields = inject(LeadFieldsService);
  #importsInputs = inject(ImportsInputsService);
  #cachedLists = inject(CachedListsService);
  #userPermissions = inject(PermissionsService);

  havePermissionsToAssign = this.#userPermissions.hasAnyPermissions([
    constants.permissions["assign-to-assignment-rule"],
    constants.permissions["assign-to-users"],
    constants.permissions["assign-to-groups"],
  ]);

  constants = constants;
  lead = model.required<Lead>();

  withItemLable = input(true);
  withAvatars = input(true);
  btnStyleClass = input(
    "w-2rem h-2rem text-xs border-circle bg-primary -ml-2 border-2 border-white p-0",
  );

  assignees = computed<ListOption[]>(() => {
    const users = this.#cachedLists.loadLists().get("assignments:all_users_info");
    return (
      users?.filter((u: { value: number }) => this.lead()?.assignees_ids?.includes(u.value)) || []
    );
  });

  model = computed(() => {
    return {
      assignees: this.lead()?.assignees_ids,
      id: this.lead().id,
      lead_type_id: this.lead().lead_type_id,
      edit_type: 1, // static (always 1)
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
  });

  fields = computed(() => [
    ...this.#importsInputs.getAssignToField({ isPopupDisplay: true }),
    this.#leadFields.getKeepMeThereField(),
    this.#leadFields.getHideHistoryField(),

    this.#leadFields.getChangeStageField(),
    this.#leadFields.getLeadStatusField(),

    this.#leadFields.getChangeRatingField(),
    this.#leadFields.getLeadRatingField(),

    this.#leadFields.getMarkOldTodosAsCompletedField(),
  ]);

  getPayload() {
    const {
      id,
      lead_type_id,
      edit_type,
      assignment_rule,
      assignment_rule_id,
      status_id,
      rating_id,
      users,
      groups,
      hide_history,
      change_stage,
      change_rating,
      keep_me_there,
      mark_old_todos_as_completed,
    } = this.model();

    return {
      id,
      lead_type_id,
      edit_type,
      assignment_rule,
      assignment_rule_id,
      status_id,
      rating_id,
      users,
      groups,
      ...(hide_history && { hide_history }),
      ...(change_stage && { change_stage }),
      ...(change_rating && { change_rating }),
      ...(keep_me_there !== "off" && { keep_me_there }),
      ...(mark_old_todos_as_completed !== "off" && { mark_old_todos_as_completed }),
    };
  }

  updateUi(lead: Lead) {
    this.lead.update(oldLead => ({ ...oldLead, assignees_ids: lead.assignees_ids }));
    this.#leadsService.updateLeadInList(this.lead());
  }
}
