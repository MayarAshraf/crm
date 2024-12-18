import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ImportsInputsService } from "@modules/Imports/services/imports-inputs.service";
import { SuspendUserModel } from "@modules/Users/services/service-types";
import { UsersService } from "@modules/Users/services/users.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
} from "@shared";
import { shareReplay } from "rxjs";

@Component({
  selector: "app-user-suspend-cu",
  standalone: true,
  templateUrl: "./user-suspend-cu.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, FormComponent, DynamicDialogComponent, TranslateModule],
})
export class UserSuspendCuComponent extends BaseCreateUpdateComponent<SuspendUserModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #cachedLists = inject(CachedListsService);
  #usersService = inject(UsersService);
  #importsInputs = inject(ImportsInputsService);

  assignedLeadsCount$ = this.#usersService
    .assignedLeadsCount(this.editData.id as number)
    .pipe(shareReplay(1));

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      dialogData$: this.assignedLeadsCount$,
      dialogSubtitle: this.editData.full_name,
      endpoints: {
        update: "users/suspend",
      },
      dialogTitle: this.translate.instant(_("suspend_user_account")),
      submitButtonLabel: this.translate.instant(_("suspend_user_account")),
    };

    this.model = new SuspendUserModel(this.editData);
    this.#cachedLists.updateLists([
      "assignments:leads_assignments_methods",
      "assignments:assignments_rules",
      "assignments:users",
      "assignments:groups",
    ]);
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        ...this.#importsInputs.getAssignToField({
          assignmentTypeKey: "assignment_rule_leads",
          assignmentRuleKey: "assignment_rule_id_leads",
          usersKey: "users_leads",
          groupsKey: "groups_leads",
        }),
      ]),
    ];
  }
}
