import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { AssignmentRulesService } from "@modules/Imports/services/assignment-rule-fields.service";
import { AssignmentRuleModel } from "@modules/Imports/services/service-types";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FormComponent,
} from "@shared";

@Component({
  selector: "app-assignment-rule-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentRuleCuComponent extends BaseCreateUpdateComponent<AssignmentRuleModel> {
  #assignmentRulesService = inject(AssignmentRulesService);
  #cachedLists = inject(CachedListsService);

  ngOnInit() {
    this.#cachedLists.updateLists(["assignments:users", "assignments:assignments_rules_types"]);

    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "imports/assignment_rules/store",
        update: "imports/assignment_rules/update",
        rules_types: "imports/assignment_rule_types/all",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_assignment_rule")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new AssignmentRuleModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_assignment_rule")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new AssignmentRuleModel();
    }
    this.fields = this.#assignmentRulesService.getAssignmentRuleFields();
  }
}
