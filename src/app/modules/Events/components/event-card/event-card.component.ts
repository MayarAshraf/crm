import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { IEvent } from "@modules/Events/services/service-types";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
  CachedListsService,
  EntitySelectComponent,
  GlobalActionService,
  InplaceDescComponent,
  ListInfoComponent,
  TimelineCardComponent,
  constants,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { EventAttendeesComponent } from "../event-fields/event-attendees.component";
import { EventEndDateComponent } from "../event-fields/event-end-date.component";
import { EventInterestsComponent } from "../event-fields/event-interests.component";
import { EventStartDateComponent } from "../event-fields/event-start-date.component";
import { EventTagsComponent } from "../event-fields/event-tags.component";
import { UpdateEventFormComponent } from "../update-event-form/update-event-form.component";

@Component({
  selector: "app-event-card",
  standalone: true,
  template: `
    <div class="relative" [id]="'scroll-target-' + event().id">
      <div #deleteTarget class="confirm-target"></div>

      <app-timeline-card [value]="event()" [moreOptions]="moreOptions">
        <div header class="flex flex-wrap align-items-center column-gap-5 row-gap-2">
          @if (displayUpdateForm()) {
            <button
              pButton
              type="button"
              icon="pi pi-chevron-left text-xs"
              class="p-button-link text-sm p-0"
              [label]="'back' | translate"
              (click)="displayUpdateForm.set(false)"
            ></button>
          } @else {
            <app-entity-select
              [(entity)]="event"
              [endpoint]="constants.API_ENDPOINTS.updateEventsData"
              apiVersion="v2"
              listModule="events"
              listName="event_types"
              updateType="type_id"
              placeholder="select_type"
            />
            <app-event-start-date [(event)]="event"></app-event-start-date>
            <app-event-end-date [(event)]="event"></app-event-end-date>
          }
        </div>

        <div content>
          @if (displayUpdateForm()) {
            <div class="py-4 px-3 bg-white border-round border-300 border-1">
              <app-update-event-form [(data)]="event" (onEventAdded)="onUpdate($event)" />
            </div>
          } @else {
            <app-inplace-input
              [(entity)]="event"
              [endpoint]="constants.API_ENDPOINTS.updateEventsData"
            />

            <p-divider styleClass="my-2"></p-divider>

            <div class="flex md:flex-wrap align-items-center justify-content-between gap-2">
              <div class="flex-1 flex flex-wrap align-items-center gap-2">
                <app-event-interests [(event)]="event"></app-event-interests>
                <app-event-tags [(event)]="event"></app-event-tags>
                @if (
                  event().country_id ||
                  event().region_id ||
                  event().city_id ||
                  event().area_place_id
                ) {
                  <button
                    pButton
                    type="button"
                    [icon]="constants.icons.info"
                    [label]="'more_details' | translate"
                    (click)="onMoreDetailsClicked()"
                    class="p-button-link text-sm p-0 text-primary"
                  ></button>
                }
              </div>

              <div class="flex-1 flex flex-wrap align-items-center md:justify-content-end gap-2">
                <app-entity-select
                  [(entity)]="event"
                  [endpoint]="constants.API_ENDPOINTS.updateEventsData"
                  apiVersion="v2"
                  listModule="events"
                  listName="event_statuses"
                  updateType="status_id"
                  placeholder="select_status"
                />
                <app-event-attendees [(event)]="event"></app-event-attendees>
              </div>
            </div>

            @if (moreDetails()) {
              <p-divider styleClass="my-2"></p-divider>
              <div
                class="flex flex-wrap align-items-start justify-content-between row-gap-3 column-gap-5"
              >
                @if (event().country_id) {
                  <app-list-info-item [label]="'country' | translate" [item]="eventCountry()" />
                }
                @if (event().region_id) {
                  <app-list-info-item [label]="'region' | translate" [item]="eventRegion()" />
                }
                @if (event().city_id) {
                  <app-list-info-item [label]="'city' | translate" [item]="eventCity()" />
                }
                @if (event().area_place_id) {
                  <app-list-info-item [label]="'area' | translate" [item]="eventArea()" />
                }
              </div>

              @if (event().address) {
                <div>
                  <p-divider styleClass="my-2"></p-divider>
                  <span class="block mb-2 text-xs">{{ "address" | translate }}</span>
                  <span class="block font-medium">{{ event().address }}</span>
                </div>
              }
            }
          }
        </div>
      </app-timeline-card>
    </div>
  `,
  styles: `
    .confirm-target {
      position: absolute;
      top: 1rem;
      left: calc(50% - 95px);
      transform: translateX(-50%);
      pointer-events: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DividerModule,
    TimelineCardComponent,
    EventStartDateComponent,
    ButtonModule,
    EventEndDateComponent,
    EventAttendeesComponent,
    EventTagsComponent,
    EventInterestsComponent,
    ListInfoComponent,
    UpdateEventFormComponent,
    EntitySelectComponent,
    InplaceDescComponent,
    TranslateModule,
  ],
})
export class EventCardComponent extends GlobalActionService {
  #el = inject(ElementRef);
  #cachedLists = inject(CachedListsService);
  #translate = inject(TranslateService);

  event = model.required<IEvent>();
  endpoint = input<string>("");
  onDelete = output<number>();

  deleteTarget = viewChild.required<ElementRef>("deleteTarget");

  displayUpdateForm = signal(false);
  constants = constants;
  moreDetails = signal(false);

  eventCountry = computed(() => {
    return this.getLabel("locations:countries:ids:null", "country_id");
  });

  eventRegion = computed(() => {
    return this.getLabel(`locations:regions:ids:${this.event().country_id}`, "region_id");
  });

  eventCity = computed(() => {
    return this.getLabel(`locations:cities:ids:${this.event().region_id}`, "city_id");
  });

  eventArea = computed(() => {
    return this.getLabel(`locations:areas:ids:${this.event().city_id}`, "area_place_id");
  });

  getLabel(slug: string, prop: keyof IEvent): string {
    return this.#cachedLists
      .loadLists()
      .get(slug)
      ?.find((data: { value: number }) => data.value === this.event()[prop])?.label;
  }

  moreOptions = [
    {
      label: this.#translate.instant(_("edit")),
      icon: constants.icons.pencil,
      command: () => this.displayUpdateForm.set(true),
    },
    {
      label: this.#translate.instant(_("logs")),
      icon: "fa fa-history",
      command: (event: any) => {},
    },
    {
      label: this.#translate.instant(_("delete")),
      icon: "fas fa-trash-alt",
      command: () => {
        const target = this.deleteTarget().nativeElement;
        this.deleteAction(this.endpoint(), target, this.event().id);
      },
    },
  ];

  onMoreDetailsClicked() {
    this.moreDetails.set(!this.moreDetails());
    this.#cachedLists.updateLists([
      "locations:countries:ids:null",
      `locations:regions:ids:${this.event()?.country_id}`,
      `locations:cities:ids:${this.event()?.region_id}`,
      `locations:areas:ids:${this.event()?.city_id}`,
    ]);
  }

  protected updateUi(): void {
    this.onDelete.emit(this.event().id);
  }

  onUpdate(event: IEvent) {
    this.event.set(event);
    this.displayUpdateForm.set(false);
    this.scrollToTarget();
  }

  scrollToTarget() {
    const id = `#scroll-target-${this.event().id}`;
    const targetElement = this.#el.nativeElement.querySelector(id);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }
}
