import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { FloorNumberCuComponent } from "./floor-number-cu.component";

@Component({
  selector: "app-broker-inventory-index-floor-numbers",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexFloorNumbersComponent extends BaseIndexComponent<
  any,
  ComponentType<FloorNumberCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-floor-numbers"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-floor-number"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-floor-number"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-floor-number"],
      ),
    });

    this.dialogComponent = FloorNumberCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/floor_numbers",
        delete: "broker_inventory/floor_numbers/delete",
      },
      indexTitle: this.translate.instant(_("floor_number")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_floor_number")),
      indexTableKey: "BI_FLOOR_NUMBSERS_KEY",
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
