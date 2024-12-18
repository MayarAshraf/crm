import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { CaseTypeModel } from "@modules/CustomerService/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { CaseTypeCuComponent } from "./case-type-cu.component";

@Component({
  selector: "app-customer-service-index-case-types",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexCaseTypesComponent extends BaseIndexComponent<
  CaseTypeModel,
  ComponentType<CaseTypeCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["view-case-types"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-case-type"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-case-type"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-case-type"]),
    });

    this.dialogComponent = CaseTypeCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "customer-service/case-types",
        delete: "customer-service/case-types/delete",
      },
      indexTitle: this.translate.instant(_("case_types")),
      indexIcon: "fas fa-comment",
      createBtnLabel: this.translate.instant(_("create_type")),
      indexTableKey: "CS_CASE_TYPES_KEY",
      columns: [
        {
          name: "order",
          title: this.translate.instant(_("order")),
          searchable: false,
          orderable: true,
        },
        {
          name: "type",
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
