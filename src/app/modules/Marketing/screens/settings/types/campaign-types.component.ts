import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { CampaignTypeModel } from "@modules/Marketing/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { CampaignTypeCuComponent } from "./campaign-type-cu.component";

@Component({
  selector: "app-index-campaign-types",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexCampaignTypesComponent extends BaseIndexComponent<
  CampaignTypeModel,
  ComponentType<CampaignTypeCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-campaign-types"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-campaign-type"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-campaign-type"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-campaign-type"]),
    });

    this.dialogComponent = CampaignTypeCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "marketing/campaign-types",
        delete: "marketing/campaign-types/delete",
      },
      indexTitle: this.translate.instant(_("campaign_types")),
      indexIcon: "fas fa-bullhorn",
      createBtnLabel: this.translate.instant(_("create_campaign_type")),
      indexTableKey: "CAMPAIGN_TYPES_KEY",
      columns: [
        {
          name: "order",
          title: this.translate.instant(_("order")),
          searchable: false,
          orderable: true,
        },
        {
          name: "campaign_type",
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
