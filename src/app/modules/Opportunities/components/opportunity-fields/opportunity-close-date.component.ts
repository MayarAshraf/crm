import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { OpportunityFieldsService } from "@modules/Opportunities/services/opportunity-fields.service";
import { IOpportunity } from "@modules/Opportunities/services/service-types";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { DateFormatterPipe, PopupFormComponent, constants } from "@shared";

@Component({
  selector: "app-opportunity-close-date",
  standalone: true,
  template: `
    <app-popup-form
      [fields]="fields()"
      [model]="model()"
      [payload]="{
        id: opportunity().id,
        update_type: 'close_date',
        update_value: model().close_date
      }"
      [endpoint]="constants.API_ENDPOINTS.updateOpportunitiesData"
      apiVersion="v2"
      [btnLabel]="btnLabel()"
      [btnTooltip]="
        opportunity().close_date
          ? ('update_expected_closing_date' | translate)
          : ('enter_expected_closing_date' | translate)
      "
      (updateUi)="opportunity.set($event)"
    />
  `,
  imports: [PopupFormComponent, TranslateModule],
  styles: `:host {font-size: 0}`,
  providers: [DateFormatterPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityCloseDateComponent {
  #opportunityFieldsService = inject(OpportunityFieldsService);
  #dateFormatter = inject(DateFormatterPipe);
  #translate = inject(TranslateService);

  opportunity = model.required<IOpportunity>();

  constants = constants;

  btnLabel = computed(() =>
    this.opportunity()?.close_date
      ? this.#dateFormatter.transform(
          this.opportunity().close_date || "",
          "absolute",
          "YYYY-MM-DD",
          "MMM D, YYYY",
        )
      : this.#translate.instant("enter_expected_closing_date"),
  );
  model = computed(() => ({ close_date: this.opportunity()?.close_date }));
  fields = computed(() => [this.#opportunityFieldsService.getCloseDateField(true)]);
}
