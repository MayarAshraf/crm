import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { LeadCampaignStatusModel } from "@modules/Marketing/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { LeadCampaignStatusCuComponent } from "./lead-campaign-status-cu.component";

@Component({
  selector: "app-index-lead-campaign-status",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexLeadCampaignStatusesComponent extends BaseIndexComponent<
  LeadCampaignStatusModel,
  ComponentType<LeadCampaignStatusCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(
        constants.permissions["index-lead-campaign-statuses"],
      ),
      create: this.#userPermission.hasPermission(
        constants.permissions["create-lead-campaign-status"],
      ),
      update: this.#userPermission.hasPermission(
        constants.permissions["update-lead-campaign-status"],
      ),
      delete: this.#userPermission.hasPermission(
        constants.permissions["delete-lead-campaign-status"],
      ),
    });

    this.dialogComponent = LeadCampaignStatusCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "marketing/lead-campaign-statuses",
        delete: "marketing/lead-campaign-statuses/delete",
      },
      indexTitle: this.translate.instant(_("lead_campaign_statuses")),
      indexIcon: "fas fa-bullhorn",
      createBtnLabel: this.translate.instant(_("create_lead_campaign_status")),
      indexTableKey: "LEAD_CAMPAIGN_STATUSES_KEY",
      columns: [
        {
          name: "order",
          title: this.translate.instant(_("order")),
          searchable: false,
          orderable: true,
        },
        {
          name: "lead_campaign_status",
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
