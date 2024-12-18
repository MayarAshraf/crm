import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { EventFieldsService } from "@modules/Events/services/event-fields.service";
import { IEvent } from "@modules/Events/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { CachedListsService, PopupFormComponent, TruncateTextPipe, constants } from "@shared";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-event-interests",
  standalone: true,
  template: `
    <app-popup-form
      [fields]="fields()"
      [model]="model()"
      [endpoint]="constants.API_ENDPOINTS.updateEventsData"
      [payload]="{
        id: event().id,
        update_type: 'interests',
        update_value: model().interests
      }"
      [btnLabel]="!event().interests_ids?.length ? ('add_interests' | translate) : ''"
      [btnIcon]="event().interests_ids?.length ? constants.icons.pencil : constants.icons.heart"
      [iconPos]="event().interests_ids?.length ? 'right' : 'left'"
      [btnStyleClass]="
        event().interests_ids?.length
          ? 'transition-none p-button-link text-500 text-xs w-auto py-0 px-2'
          : 'transition-none bg-red border-red px-2 py-1 text-xs line-height-1'
      "
      [btnTooltip]="
        event().interests_ids?.length
          ? ('edit_interests' | translate)
          : ('add_interests' | translate)
      "
      [isEditHovered]="event().interests_ids?.length ? true : false"
      apiVersion="v2"
      (updateUi)="event.set($event)"
    >
      @if (event().interests_ids?.length) {
        @for (interest of interests(); track $index) {
          <span
            class="bg-red text-white py-1 px-2 line-height-1 border-round text-xs"
            [pTooltip]="interest.label"
            tooltipPosition="top"
          >
            <i [class]="constants.icons.heart"></i>
            {{ interest.label | truncateText: 15 }}
          </span>
        }
      }
    </app-popup-form>
  `,
  imports: [PopupFormComponent, TooltipModule, TruncateTextPipe, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventInterestsComponent {
  #eventFieldsService = inject(EventFieldsService);
  #cachedLists = inject(CachedListsService);
  constants = constants;

  event = model.required<IEvent>();

  interests = computed(() => {
    const interests = this.#cachedLists.loadLists().get("interests:interests");
    return interests?.filter(
      (i: { value: number }) => this.event()?.interests_ids?.includes(i.value),
    );
  });

  model = computed(() => ({ interests: this.event()?.interests_ids }));
  fields = computed(() => [this.#eventFieldsService.getInterestsField()]);
}
