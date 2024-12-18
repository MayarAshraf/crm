import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { BaseIndexComponent, PermissionsService, TableWrapperComponent, constants } from "@shared";
import { ResourceTypeCuComponent } from "./type-cu.component";

@Component({
  selector: "app-index-resources-types",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexResourcesTypesComponent extends BaseIndexComponent<
  any,
  ComponentType<ResourceTypeCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-resource-types"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-resource-type"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-resource-type"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-resource-type"]),
    });

    this.dialogComponent = ResourceTypeCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "resources/resource_types",
        delete: "resources/resource_types/delete",
      },
      indexTitle: this.translate.instant(_("resource_types")),
      indexIcon: "fas fa-list",
      createBtnLabel: this.translate.instant(_("create_type")),
      indexTableKey: "RESOURCES_TYPES_KEY",
      columns: [
        { name: "id", title: this.translate.instant(_("id")), searchable: true, orderable: true },
        {
          name: "order",
          title: this.translate.instant(_("order")),
          searchable: false,
          orderable: true,
        },
        {
          name: "title",
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
