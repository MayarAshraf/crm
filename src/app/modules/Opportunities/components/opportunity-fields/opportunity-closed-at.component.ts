import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { OpportunityFieldsService } from "@modules/Opportunities/services/opportunity-fields.service";
import { IOpportunity } from "@modules/Opportunities/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { DateFormatterPipe, PopupFormComponent, constants } from "@shared";

@Component({
  selector: "app-opportunity-closed-at",
  standalone: true,
  template: `
    <app-popup-form
      [fields]="fields()"
      [model]="model()"
      [payload]="{
        id: opportunity().id,
        update_type: 'closed_at',
        update_value: model().closed_at
      }"
      apiVersion="v2"
      [endpoint]="constants.API_ENDPOINTS.updateOpportunitiesData"
      [btnLabel]="btnLabel()"
      [btnTooltip]="
        opportunity().closed_at
          ? ('update_closed_at_date' | translate)
          : ('enter_closed_at_date' | translate)
      "
      (updateUi)="opportunity.set($event)"
    />
  `,
  imports: [PopupFormComponent, TranslateModule],
  styles: `:host { font-size: 0 }`,
  providers: [DateFormatterPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityClosedAtComponent {
  #opportunityFieldsService = inject(OpportunityFieldsService);
  #dateFormatter = inject(DateFormatterPipe);

  opportunity = model.required<IOpportunity>();
  constants = constants;

  btnLabel = computed(() =>
    this.opportunity()?.closed_at
      ? this.#dateFormatter.transform(
          this.opportunity().closed_at || "",
          "absolute",
          "YYYY-MM-DD",
          "MMM D, YYYY",
        )
      : "Enter closed at date",
  );

  model = computed(() => ({ closed_at: this.opportunity()?.closed_at }));
  fields = computed(() => [this.#opportunityFieldsService.getClosedAtField(true)]);
}
