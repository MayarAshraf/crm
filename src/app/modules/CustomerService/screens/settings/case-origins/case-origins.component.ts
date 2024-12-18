import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { CaseOriginModel } from "@modules/CustomerService/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { CaseOriginCuComponent } from "./case-origin-cu.component";

@Component({
  selector: "app-customer-service-index-case-origins",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexCaseOriginsComponent extends BaseIndexComponent<
  CaseOriginModel,
  ComponentType<CaseOriginCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["view-case-origins"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-case-origin"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-case-origin"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-case-origin"]),
    });

    this.dialogComponent = CaseOriginCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "customer-service/case-origins",
        delete: "customer-service/case-origins/delete",
      },
      indexTitle: this.translate.instant(_("case_origins")),
      indexIcon: "fas fa-comment",
      createBtnLabel: this.translate.instant(_("create_case_origin")),
      indexTableKey: "CS_CASE_ORIGINS_KEY",
      columns: [
        {
          name: "order",
          title: this.translate.instant(_("order")),
          searchable: false,
          orderable: true,
        },
        {
          name: "origin",
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
