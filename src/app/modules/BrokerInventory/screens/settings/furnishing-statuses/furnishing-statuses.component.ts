import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { FurnishingStatusModel } from "@modules/BrokerInventory/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { FurnishingStatusCuComponent } from "./furnishing-status-cu.component";

@Component({
  selector: "app-broker-inventory-index-furnishing-statuses",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexFurnishingStatusesComponent extends BaseIndexComponent<
  FurnishingStatusModel,
  ComponentType<FurnishingStatusCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-furnishing-statuses"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-broker-inventory-furnishing-status"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-furnishing-status"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-broker-inventory-furnishing-status"],
      ),
    });

    this.dialogComponent = FurnishingStatusCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "broker_inventory/furnishing_statuses",
        delete: "broker_inventory/furnishing_statuses/delete",
      },
      indexTitle: this.translate.instant(_("furnishing_statuses")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_furnishing_status")),
      indexTableKey: "BI_FURNISHINGS_TATUSES_KEY",
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
