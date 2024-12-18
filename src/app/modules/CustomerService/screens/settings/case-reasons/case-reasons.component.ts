import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { CaseReasonModel } from "@modules/CustomerService/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { CaseReasonCuComponent } from "./case-reason-cu.component";

@Component({
  selector: "app-customer-service-index-case-reasons",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexCaseReasonsComponent extends BaseIndexComponent<
  CaseReasonModel,
  ComponentType<CaseReasonCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["view-case-reasons"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-case-reason"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-case-reason"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-case-reason"]),
    });

    this.dialogComponent = CaseReasonCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "customer-service/case-reasons",
        delete: "customer-service/case-reasons/delete",
      },
      indexTitle: this.translate.instant(_("case_reasons")),
      indexIcon: "fas fa-comment",
      createBtnLabel: this.translate.instant(_("create_case_reason")),
      indexTableKey: "CS_CASE_REASONS_KEY",
      columns: [
        {
          name: "order",
          title: this.translate.instant(_("order")),
          searchable: false,
          orderable: true,
        },
        {
          name: "reason",
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
