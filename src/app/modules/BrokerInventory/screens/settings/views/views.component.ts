import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { ViewModel } from "@modules/BrokerInventory/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { ViewCuComponent } from "./view-cu.component";

@Component({
  selector: "app-broker-inventory-index-views",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexViewsComponent extends BaseIndexComponent<
  ViewModel,
  ComponentType<ViewCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-views"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-view"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-view"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-view"],
      ),
    });

    this.dialogComponent = ViewCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/views",
        delete: "broker_inventory/views/delete",
      },
      indexTitle: this.translate.instant(_("views")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_view")),
      indexTableKey: "BI_VIEWS_KEY",
      columns: [
        {
          name: "order",
          title: this.translate.instant(_("order")),
          searchable: false,
          orderable: true,
        },
        {
          name: "value",
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
