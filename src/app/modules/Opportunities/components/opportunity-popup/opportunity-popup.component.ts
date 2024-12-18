import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { OpportunityFieldsService } from "@modules/Opportunities/services/opportunity-fields.service";
import { IOpportunity, OpportunityModel } from "@modules/Opportunities/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { BasePopupFormComponent, CachedListsService } from "@shared";

@Component({
  selector: "app-opportunity-popup",
  standalone: true,
  template: `
    <app-base-popup-form
      [fields]="fields"
      [model]="model()"
      endpoint="opportunities/opportunities/store"
      apiVersion="v2"
      (updateUi)="onOpportunityAdded.emit($event)"
    >
      <span class="block mb-3 text-primary">
        {{"new_deal"|translate}}
        <span class="text-xs">({{ data()?.full_name }})</span>
      </span>
    </app-base-popup-form>
  `,
  imports: [BasePopupFormComponent,TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityPopupComponent {
  #opportunityFields = inject(OpportunityFieldsService);
  #cachedLists = inject(CachedListsService);

  data = model.required<any>();
  opportunitableType = input<string>("");
  onOpportunityAdded = output<IOpportunity>();

  model = computed(
    () =>
      new OpportunityModel({
        opportunitable_id: this.data().id,
        opportunitable_type: this.opportunitableType(),
      }),
  );
  fields: FormlyFieldConfig[] = [];

  ngOnInit() {
    this.#cachedLists.updateLists([
      "pipelines:deal_pipelines",
      "marketing:currencies",
      "interests:interests",
      "tags:tags",
      "assignments:users",
      "brokers:brokers",
    ]);
    this.fields = this.#opportunityFields.configureFields();
  }
}
