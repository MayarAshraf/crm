import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { CampaignStatusModel } from "@modules/Marketing/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { CampaignStatusCuComponent } from "./campaign-status-cu.component";

@Component({
  selector: "app-index-campaign-statuses",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexCampaignStatusesComponent extends BaseIndexComponent<
  CampaignStatusModel,
  ComponentType<CampaignStatusCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-campaign-statuses"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-campaign-status"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-campaign-status"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-campaign-status"]),
    });

    this.dialogComponent = CampaignStatusCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "marketing/campaign-statuses",
        delete: "marketing/campaign-statuses/delete",
      },
      indexTitle: this.translate.instant(_("campaign_statuses")),
      indexIcon: "fas fa-bullhorn",
      createBtnLabel: this.translate.instant(_("create_campaign_status")),
      indexTableKey: "CAMPAIGN_STATUSES_KEY",
      columns: [
        {
          name: "order",
          title: this.translate.instant(_("order")),
          searchable: false,
          orderable: true,
        },
        {
          name: "campaign_status",
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
