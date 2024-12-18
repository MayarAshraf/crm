import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { EventFieldsService } from "@modules/Events/services/event-fields.service";
import { IEvent } from "@modules/Events/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { CachedListsService, PopupFormComponent, TruncateTextPipe, constants } from "@shared";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-event-tags",
  standalone: true,
  template: `
    <app-popup-form
      [fields]="fields()"
      [model]="model()"
      [payload]="{
        id: event().id,
        update_type: 'tags',
        update_value: model().tags
      }"
      [endpoint]="constants.API_ENDPOINTS.updateEventsData"
      apiVersion="v2"
      [isEditHovered]="event().tags_ids?.length ? true : false"
      [btnLabel]="!event().tags_ids?.length ? ('add_tags' | translate) : ''"
      [btnTooltip]="
        event().tags_ids?.length ? ('edit_tags' | translate) : ('add_tags' | translate)
      "
      [btnIcon]="event().tags_ids?.length ? constants.icons.pencil : constants.icons.tag"
      [iconPos]="event().tags_ids?.length ? 'right' : 'left'"
      [btnStyleClass]="
        event().tags_ids?.length
          ? 'transition-none p-button-link text-500 text-xs w-auto py-0 px-2'
          : 'transition-none bg-dark-purple border-dark-purple px-2 py-1 text-xs line-height-1'
      "
      (updateUi)="event.set($event)"
    >
      @if (event().tags_ids?.length) {
        @for (tag of tags(); track $index) {
          <span
            class="bg-dark-purple text-white py-1 px-2 line-height-1 border-round text-xs"
            [pTooltip]="tag.label"
            tooltipPosition="top"
          >
            <i [class]="constants.icons.tag"></i>
            {{ tag.label | truncateText: 15 }}
          </span>
        }
      }
    </app-popup-form>
  `,
  imports: [PopupFormComponent, TooltipModule, TruncateTextPipe, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTagsComponent {
  #eventFieldsService = inject(EventFieldsService);
  #cachedLists = inject(CachedListsService);
  constants = constants;

  event = model.required<IEvent>();

  tags = computed(() => {
    const tags = this.#cachedLists.loadLists().get("tags:tags");
    return tags?.filter((u: { value: number }) => this.event()?.tags_ids?.includes(u.value));
  });

  fields = computed(() => [this.#eventFieldsService.getTagsField()]);
  model = computed(() => ({ tags: this.event()?.tags_ids }));
}
