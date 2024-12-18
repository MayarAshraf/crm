import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { BathroomModel } from "@modules/BrokerInventory/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { BathroomCuComponent } from "./bathroom-cu.component";

@Component({
  selector: "app-broker-inventory-index-bathrooms",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexBathroomsComponent extends BaseIndexComponent<
  BathroomModel,
  ComponentType<BathroomCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-bathrooms"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-bathroom"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-bathroom"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-bathroom"],
      ),
    });

    this.dialogComponent = BathroomCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/bathrooms",
        delete: "broker_inventory/bathrooms/delete",
      },
      indexTitle: this.translate.instant(_("bathroom")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_bathroom")),
      indexTableKey: "BI_BATHROOMS_KEY",
      columns: [
        {
          name: "order",
          title: this.translate.instant(_("order")),
          searchable: false,
          orderable: true,
        },
        {
          name: "count",
          title: this.translate.instant(_("count")),
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
