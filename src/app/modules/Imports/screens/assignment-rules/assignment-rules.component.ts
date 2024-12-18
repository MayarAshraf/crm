import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, TemplateRef, inject, viewChild } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { TranslateModule } from "@ngx-translate/core";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { AssignmentRuleCuComponent } from "./assignment-rule-cu.component";

@Component({
  selector: "app-assignment-rules-index",
  standalone: true,
  templateUrl: "./assignment-rules.component.html",
  imports: [TableWrapperComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexAssignmentRulesComponent extends BaseIndexComponent<
  any,
  ComponentType<AssignmentRuleCuComponent>
> {
  #userPermission = inject(PermissionsService);

  autoHandoverInfo = viewChild.required<TemplateRef<any>>("autoHandoverInfo");
  ruleInfo = viewChild.required<TemplateRef<any>>("ruleInfo");

  ngOnInit() {
    this.dialogConfig = { ...this.dialogConfig, width: "550px" };

    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-assignment-rules"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-assignment-rule"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-assignment-rule"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-assignment-rule"]),
    });

    this.dialogComponent = AssignmentRuleCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "imports/assignment_rules/all",
        delete: "imports/assignment_rules/delete",
      },
      indexTitle: this.translate.instant(_("assignment_rules")),
      indexIcon: "fas fa-sync",
      createBtnLabel: this.translate.instant(_("create_assignment_rule")),
      indexTableKey: "ASSIGNMENT_RULES_KEY",
      columns: [
        { name: "id", title: this.translate.instant(_("id")), searchable: false, orderable: true },
        {
          name: "name",
          title: this.translate.instant(_("assignment_rule_info")),
          searchable: true,
          orderable: false,
          render: this.ruleInfo(),
        },
        {
          name: "auto_hand_over",
          title: this.translate.instant(_("auto_hand_over")),
          searchable: false,
          orderable: false,
          render: this.autoHandoverInfo(),
        },
        {
          name: "created_at",
          title: this.translate.instant(_("created_at")),
          searchable: false,
          orderable: false,
        },
        {
          name: "creator.full_name",
          title: this.translate.instant(_("created_by")),
          searchable: false,
          orderable: false,
        },
      ],
    };
  }
}
