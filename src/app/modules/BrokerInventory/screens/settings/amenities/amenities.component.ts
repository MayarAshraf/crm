import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { AmenityModel } from "@modules/BrokerInventory/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { AmenityCuComponent } from "./amenity-cu.component";

@Component({
  selector: "app-broker-inventory-index-amenities",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexAmenitiesComponent extends BaseIndexComponent<
  AmenityModel,
  ComponentType<AmenityCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-amenities"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-amenity"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-amenity"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-amenity"],
      ),
    });

    this.dialogComponent = AmenityCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/amenities",
        delete: "broker_inventory/amenities/delete",
      },
      reorderEndpoint: "broker_inventory/amenities/update-order",
      reorderableRows: true,
      indexTitle: this.translate.instant(_("amenities")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_amenity")),
      indexTableKey: "BI_AMENITIES_KEY",
      columns: [
        { name: "id", title: this.translate.instant(_("id")), searchable: true, orderable: true },
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
