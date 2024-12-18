import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { LostReasonModel } from "@modules/Opportunities/services/service-types";
import { BaseIndexComponent, TableWrapperComponent } from "@shared";
import { LeadLostReasonCuComponent } from "./lost-reason-cu.component";

@Component({
  selector: "app-index-lost-reasons-status",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexLeadLostReasonsStatusesComponent extends BaseIndexComponent<
  LostReasonModel,
  ComponentType<LeadLostReasonCuComponent>
> {
  ngOnInit() {
    this.dialogComponent = LeadLostReasonCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "opportunities/lost_reasons/all",
        delete: "opportunities/lost_reasons/delete",
      },
      indexTitle: this.translate.instant(_("lost_reasons")),
      indexIcon: "fas fa-bill-money",
      createBtnLabel: this.translate.instant(_("create_lost_reason")),
      indexTableKey: "LOST_REASONS_KEY",
      columns: [
        {
          name: "order",
          title: this.translate.instant(_("order")),
          searchable: false,
          orderable: true,
        },
        {
          name: "name",
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
