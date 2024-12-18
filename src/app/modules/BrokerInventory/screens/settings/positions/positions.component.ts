import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { PositionModel } from "@modules/BrokerInventory/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { PositionCuComponent } from "./position-cu.component";

@Component({
  selector: "app-broker-inventory-index-positions",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexPositionsComponent extends BaseIndexComponent<
  PositionModel,
  ComponentType<PositionCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-positions"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-position"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-position"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-position"],
      ),
    });

    this.dialogComponent = PositionCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/positions",
        delete: "broker_inventory/positions/delete",
      },
      indexTitle: this.translate.instant(_("positions")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_position")),
      indexTableKey: "BI_POSITIONS_KEY",
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
