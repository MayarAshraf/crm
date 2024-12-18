import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { EventFieldsService } from "@modules/Events/services/event-fields.service";
import { IEvent } from "@modules/Events/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { AvatarListComponent, CachedListsService, PopupFormComponent, constants } from "@shared";

@Component({
  selector: "app-event-attendees",
  standalone: true,
  template: `
    <app-popup-form
      [fields]="fields()"
      [model]="model()"
      [endpoint]="constants.API_ENDPOINTS.updateEventsData"
      apiVersion="v2"
      [payload]="{ id: event().id, update_type: 'attendees', update_value: model().attendees }"
      [btnTooltip]="
        attendees().length ? ('edit_attendees' | translate) : ('enter_attendees' | translate)
      "
      tooltipPosition="left"
      [isEditHovered]="false"
      btnStyleClass="w-2rem h-2rem text-xs border-circle bg-primary -ml-2 border-2 border-white p-0"
      (updateUi)="event.set($event)"
    >
      <span topForm class="block text-primary text-xs font-medium mb-3">
        {{ attendees().length ? ("edit_attendees" | translate) : ("enter_attendees" | translate) }}
      </span>
      @if (attendees().length) {
        <app-avatar-list [items]="attendees()" />
      }
    </app-popup-form>
  `,
  imports: [PopupFormComponent, AvatarListComponent, TranslateModule],
  styles: `:host {font-size: 0}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventAttendeesComponent {
  #eventFieldsService = inject(EventFieldsService);
  #cachedLists = inject(CachedListsService);

  constants = constants;

  event = model.required<IEvent>();

  attendees = computed(() => {
    const users = this.#cachedLists.loadLists().get("assignments:all_users_info");
    return (
      users?.filter((u: { value: number }) => this.event().attendees_ids?.includes(u.value)) || []
    );
  });

  fields = computed(() => [this.#eventFieldsService.getAttendeesField()]);
  model = computed(() => ({ attendees: this.event().attendees_ids }));
}
