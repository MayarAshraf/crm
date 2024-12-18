import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { FacilityModel } from "@modules/BrokerInventory/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { FacilityCuComponent } from "./facility-cu.component";

@Component({
  selector: "app-index-facilities",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexFacilitiesComponent extends BaseIndexComponent<
  FacilityModel,
  ComponentType<FacilityCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-facilities"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-facility"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-facility"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-facility"],
      ),
    });

    this.dialogComponent = FacilityCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/facilities",
        delete: "broker_inventory/facilities/delete",
      },
      reorderEndpoint: "broker_inventory/facilities/update-order",
      reorderableRows: true,
      indexTitle: this.translate.instant(_("facilities")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_facility")),
      indexTableKey: "BI_FACILITIES_KEY",
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
