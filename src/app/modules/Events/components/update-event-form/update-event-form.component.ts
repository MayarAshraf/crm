import { ChangeDetectionStrategy, Component, computed, inject, model, output } from "@angular/core";
import { EventFieldsService } from "@modules/Events/services/event-fields.service";
import { EventModel, IEvent } from "@modules/Events/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { BasePopupFormComponent, CachedListsService } from "@shared";

@Component({
  selector: "app-update-event-form",
  standalone: true,
  template: `
    <app-base-popup-form
      [fields]="fields"
      [model]="model()"
      endpoint="events/events/update"
      apiVersion="v2"
      (updateUi)="onEventAdded.emit($event)"
    />
  `,
  imports: [BasePopupFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateEventFormComponent {
  #eventFieldsService = inject(EventFieldsService);
  #cachedLists = inject(CachedListsService);

  data = model.required<any>();
  onEventAdded = output<IEvent>();

  model = computed(() => new EventModel(this.data()));
  fields: FormlyFieldConfig[] = [];

  ngOnInit() {
    let lists = [
      "events:event_types",
      "events:event_statuses",
      "assignments:users",
      "interests:interests",
      "tags:tags",
    ];
    this.data()?.country_id && lists.push(`locations:regions:ids:${this.data().country_id}`);
    this.data()?.region_id && lists.push(`locations:cities:ids:${this.data().region_id}`);
    this.data()?.city_id && lists.push(`locations:areas:ids:${this.data().city_id}`);
    this.#cachedLists.updateLists(lists);
    this.fields = this.#eventFieldsService.configureFields();
  }
}
