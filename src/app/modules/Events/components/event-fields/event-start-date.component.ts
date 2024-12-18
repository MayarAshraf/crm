import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { EventFieldsService } from "@modules/Events/services/event-fields.service";
import { IEvent } from "@modules/Events/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { DateFormatterPipe, PopupFormComponent, constants } from "@shared";

@Component({
  selector: "app-event-start-date",
  standalone: true,
  template: `
    <app-popup-form
      [fields]="fields()"
      [model]="model()"
      [payload]="{
        id: event().id,
        update_type: 'start_date',
        update_value: model().start_date
      }"
      [endpoint]="constants.API_ENDPOINTS.updateEventsData"
      apiVersion="v2"
      [btnLabel]="btnLabel()"
      [btnTooltip]="
        event().start_date ? ('update_start_date' | translate) : ('set_start_date' | translate)
      "
      (updateUi)="event.set($event)"
    />
  `,
  imports: [PopupFormComponent, TranslateModule],
  providers: [DateFormatterPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventStartDateComponent {
  #eventFieldsService = inject(EventFieldsService);
  #dateFormatter = inject(DateFormatterPipe);

  event = model.required<IEvent>();

  constants = constants;

  btnLabel = computed(() =>
    this.event()?.start_date
      ? "At: " + this.#dateFormatter.transform(this.event().start_date || "", "absolute")
      : "Enter Start Date",
  );
  model = computed(() => ({ start_date: this.event()?.start_date }));
  fields = computed(() => [this.#eventFieldsService.getStartDateUiField()]);
}
