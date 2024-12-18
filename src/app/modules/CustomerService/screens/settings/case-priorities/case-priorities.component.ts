import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { CasePriorityModel } from "@modules/CustomerService/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { CasePriorityCuComponent } from "./case-priority-cu.component";

@Component({
  selector: "app-customer-service-index-case-priorities",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexCasePrioritiesComponent extends BaseIndexComponent<
  CasePriorityModel,
  ComponentType<CasePriorityCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["view-case-priorities"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-case-priority"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-case-priority"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-case-priority"]),
    });

    this.dialogComponent = CasePriorityCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "customer-service/case-priorities",
        delete: "customer-service/case-priorities/delete",
      },
      indexTitle: this.translate.instant(_("case_priorities")),
      indexIcon: "fas fa-comment",
      createBtnLabel: this.translate.instant(_("create_case_priority")),
      indexTableKey: "CS_CASE_PRIORITIES_KEY",
      columns: [
        {
          name: "order",
          title: this.translate.instant(_("order")),
          searchable: false,
          orderable: true,
        },
        {
          name: "priority",
          title: this.translate.instant(_("name")),
          searchable: true,
          orderable: false,
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
