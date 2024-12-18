import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { EventFieldsService } from "@modules/Events/services/event-fields.service";
import { EventModel, IEvent } from "@modules/Events/services/service-types";
import { LocationsInputsService } from "@modules/Locations/services/locations-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { BasePopupFormComponent, CachedListsService, constants } from "@shared";

@Component({
  selector: "app-event-action",
  standalone: true,
  template: `
    <app-base-popup-form
      [fields]="fields"
      [model]="model()"
      endpoint="events/events/store"
      apiVersion="v2"
      (updateUi)="onEventAdded.emit($event)"
    >
      <span class="block mb-3 text-primary">
        {{ "set_new_meeting" | translate }}
        <span class="text-xs">({{ data()?.full_name }})</span>
      </span>
    </app-base-popup-form>
  `,
  imports: [BasePopupFormComponent, TranslateModule],
  providers: [LocationsInputsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventActionComponent {
  #eventFieldsService = inject(EventFieldsService);
  #cachedLists = inject(CachedListsService);

  data = model.required<any>();
  eventableType = input<string>("");
  onEventAdded = output<IEvent>();

  model = computed(
    () =>
      new EventModel({
        eventable_id: this.data().id,
        eventable_type: this.eventableType(),
      }),
  );

  fields: FormlyFieldConfig[] = [];

  ngOnInit() {
    this.#cachedLists.updateLists([
      "events:event_types",
      "events:event_statuses",
      "assignments:users",
      "interests:interests",
      "tags:tags",
      "locations:countries:ids:null",
      `locations:regions:ids:${constants.DEFAULT_COUNTRY_ID}`,
    ]);
    this.fields = this.#eventFieldsService.configureFields();
  }
}
