import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { AreaUnitModel } from "@modules/BrokerInventory/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { AreaUnitCuComponent } from "./area-unit-cu.component";
@Component({
  selector: "app-broker-inventory-index-area-units",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexAreaUnitsComponent extends BaseIndexComponent<
  AreaUnitModel,
  ComponentType<AreaUnitCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-area-units"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-area-unit"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-area-unit"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-area-unit"],
      ),
    });

    this.dialogComponent = AreaUnitCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/area_units",
        delete: "broker_inventory/area_units/delete",
      },
      indexTitle: this.translate.instant(_("area_units")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_area_unit")),
      indexTableKey: "BI_AREA_UNITS_KEY",
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
