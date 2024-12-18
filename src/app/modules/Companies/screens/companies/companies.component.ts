import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { CompanyCuComponent } from "./company-cu.component";

@Component({
  selector: "app-index-companies",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexResourcesTypesComponent extends BaseIndexComponent<
  any,
  ComponentType<CompanyCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-companies"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-company"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-company"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-company"]),
    });

    this.dialogComponent = CompanyCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "companies",
        delete: "companies/delete",
      },
      indexTitle: this.translate.instant(_("companies")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_company")),
      indexTableKey: "COMPANIES_KEY",
      columns: [
        { name: "id", title: this.translate.instant(_("id")), searchable: false, orderable: true },
        {
          name: "company_name",
          title: this.translate.instant(_("name")),
          searchable: true,
          orderable: true,
        },
        {
          name: "mobile_number",
          title: this.translate.instant(_("mobile_number")),
          searchable: false,
          orderable: true,
        },
        {
          name: "hotline",
          title: this.translate.instant(_("hotline")),
          searchable: false,
          orderable: true,
        },
        {
          name: "email",
          title: this.translate.instant(_("email")),
          searchable: false,
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
