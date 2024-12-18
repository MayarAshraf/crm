import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ITEM_LEAD } from "@modules/Leads/services/service-types";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FormComponent,
} from "@shared";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { OpportunityFieldsService } from "../services/opportunity-fields.service";
import { OpportunityModel } from "../services/service-types";

@Component({
  selector: "app-opportunity-cu",
  standalone: true,
  imports: [FormComponent, DynamicDialogComponent],
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityCuComponent extends BaseCreateUpdateComponent<OpportunityModel> {
  #cachedLists = inject(CachedListsService);
  #opportunityFields = inject(OpportunityFieldsService);

  ngOnInit(): void {
    this.#cachedLists.updateLists([
      "pipelines:deal_pipelines",
      "marketing:currencies",
      "interests:interests",
      "tags:tags",
      "assignments:users",
    ]);

    this.dialogMeta = {
      ...this.dialogMeta,
      createApiVersion: "v2",
      updateApiVersion: "v2",
      endpoints: {
        store: "opportunities/opportunities/store",
        update: "opportunities/opportunities/update",
      },
    };

    if (this.editData) {
      const pipelineId = this.editData?.pipeline_id;
      pipelineId && this.#cachedLists.updateLists([`pipelines:pipeline_stages:id:${pipelineId}`]);

      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_deal")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new OpportunityModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_deal")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new OpportunityModel();
    }

    this.fields = [
      {
        key: "opportunitable_info",
        type: "autocomplete-field",
        props: {
          required: true,
          disabled: this.editData,
          label: _("customer"),
          placeholder: _("name_company_phone_number"),
          entity: ITEM_LEAD,
          fieldKey: "opportunitable_id",
        },
      },
      /* {
          key: "opportunitable_id", // exist in "this.#opportunityFields.configureFields()"
        }, */
      ...this.#opportunityFields.configureFields(),
    ];
  }
}
