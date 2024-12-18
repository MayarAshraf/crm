import { ChangeDetectionStrategy, Component, computed, inject, model, output } from "@angular/core";
import { OpportunityFieldsService } from "@modules/Opportunities/services/opportunity-fields.service";
import { IOpportunity, OpportunityModel } from "@modules/Opportunities/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { BasePopupFormComponent, CachedListsService } from "@shared";

@Component({
  selector: "app-update-opportunity-form",
  standalone: true,
  template: `
    <app-base-popup-form
      [fields]="fields"
      [model]="model()"
      endpoint="opportunities/opportunities/update"
      apiVersion="v2"
      (updateUi)="onOpportunityAdded.emit($event)"
    />
  `,
  imports: [BasePopupFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateOpportunityFormComponent {
  #opportunityFields = inject(OpportunityFieldsService);
  #cachedLists = inject(CachedListsService);

  data = model.required<any>();
  onOpportunityAdded = output<IOpportunity>();

  model = computed(() => new OpportunityModel(this.data()));
  fields: FormlyFieldConfig[] = [];

  ngOnInit() {
    let lists = [
      "pipelines:deal_pipelines",
      "marketing:currencies",
      "interests:interests",
      "tags:tags",
      "assignments:users",
      "brokers:brokers",
    ];
    this.data()?.pipeline_id && lists.push(`pipelines:pipeline_stages:id:${this.data().pipeline_id}`);
    this.#cachedLists.updateLists(lists);
    this.fields = this.#opportunityFields.configureFields();
  }
}
