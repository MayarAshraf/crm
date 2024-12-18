import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { EventFieldsService } from "@modules/Events/services/event-fields.service";
import { IEvent } from "@modules/Events/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { DateFormatterPipe, PopupFormComponent, constants } from "@shared";

@Component({
  selector: "app-event-end-date",
  standalone: true,
  template: `
    <app-popup-form
      [fields]="fields()"
      [model]="model()"
      [payload]="{
        id: event().id,
        update_type: 'end_date',
        update_value: model().end_date
      }"
      [endpoint]="constants.API_ENDPOINTS.updateEventsData"
      apiVersion="v2"
      [btnLabel]="btnLabel()"
      [btnTooltip]="
        event().end_date ? ('update_end_date' | translate) : ('set_end_date' | translate)
      "
      (updateUi)="event.set($event)"
    />
  `,
  imports: [PopupFormComponent, TranslateModule],
  providers: [DateFormatterPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventEndDateComponent {
  #eventFieldsService = inject(EventFieldsService);
  #dateFormatter = inject(DateFormatterPipe);

  constants = constants;

  event = model.required<IEvent>();

  btnLabel = computed(() =>
    this.event()?.end_date
      ? "To: " + this.#dateFormatter.transform(this.event().end_date || "", "absolute")
      : "Set End Date",
  );
  fields = computed(() => [this.#eventFieldsService.getEndDateUiField(true)]);
  model = computed(() => ({ end_date: this.event()?.end_date }));
}
