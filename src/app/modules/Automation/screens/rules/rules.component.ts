import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { Rule } from "@modules/Automation/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { AutomationRuleCuComponent } from "./rule-cu.component";

@Component({
  selector: "app-index-automation-rules",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexAutomationRulesComponent extends BaseIndexComponent<
  Rule,
  ComponentType<AutomationRuleCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-automation-rules"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-automation-rule"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-automation-rule"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-automation-rule"]),
    });

    this.dialogComponent = AutomationRuleCuComponent;
    this.dialogConfig = { ...this.dialogConfig, width: "800px" };

    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "automation/rules",
        delete: "automation/rules/delete",
      },
      indexTitle: this.translate.instant(_("automation_rules")),
      indexIcon: constants.icons.robot,
      createBtnLabel: this.translate.instant(_("create_automation_rule")),
      indexTableKey: "AUTOMATIONRULES_KEY",
      columns: [
        { name: "id", title: this.translate.instant(_("id")), searchable: false, orderable: true },
        {
          name: "name",
          title: this.translate.instant(_("name")),
          searchable: true,
          orderable: true,
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
