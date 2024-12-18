import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, signal } from "@angular/core";
import { ActivityCardComponent } from "@modules/Activities/components/activity-card/activity-card.component";
import { ITEM_CLASS_ACTIVITY } from "@modules/Activities/services/service-types";
import { EventCardComponent } from "@modules/Events/components/event-card/event-card.component";
import { ITEM_CLASS_EVENT } from "@modules/Events/services/service-types";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { Lead, LeadTimeline, LeadsPaginator } from "@modules/Leads/services/service-types";
import { NoteCardComponent } from "@modules/Notes/components/note-card/note-card.component";
import { ITEM_CLASS_NOTE } from "@modules/Notes/services/service-types";
import { OpportunityCardComponent } from "@modules/Opportunities/components/opportunity-card/opportunity-card.component";
import { ITEM_CLASS_OPPORTUNITY } from "@modules/Opportunities/services/service-types";
import { TaskCardComponent } from "@modules/Tasks/components/task-card/task-card.component";
import { ITEM_CLASS_TASK } from "@modules/Tasks/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  CachedLabelsService,
  CachedListsService,
  InitialsPipe,
  LangService,
  RandomColorPipe,
  constants,
} from "@shared";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { TimelineModule } from "primeng/timeline";
import { TooltipModule } from "primeng/tooltip";
import { BehaviorSubject, Observable, map, scan, switchMap, tap } from "rxjs";

@Component({
  selector: "app-lead-timeline",
  standalone: true,
  templateUrl: "./lead-timeline.component.html",
  styleUrls: ["./lead-timeline.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    TimelineModule,
    ActivityCardComponent,
    EventCardComponent,
    OpportunityCardComponent,
    TaskCardComponent,
    NoteCardComponent,
    TooltipModule,
    InfiniteScrollDirective,
    InitialsPipe,
    TranslateModule,
    RandomColorPipe,
  ],
})
export class LeadTimelineComponent {
  #leadsService = inject(LeadsService);
  #cachedLists = inject(CachedListsService);
  #cachedLabels = inject(CachedLabelsService);
  currentLang = inject(LangService).currentLanguage;

  lead = input<Lead>({} as Lead);
  leadTimeline = this.#leadsService.leadTimeline;
  constants = constants;
  ITEM_CLASS_ACTIVITY = ITEM_CLASS_ACTIVITY;
  ITEM_CLASS_EVENT = ITEM_CLASS_EVENT;
  ITEM_CLASS_OPPORTUNITY = ITEM_CLASS_OPPORTUNITY;
  ITEM_CLASS_NOTE = ITEM_CLASS_NOTE;
  ITEM_CLASS_TASK = ITEM_CLASS_TASK;
  paginator$!: Observable<LeadsPaginator>;
  loading = signal(true);
  #page$ = new BehaviorSubject(1);

  getLabelById(listKey: string, id: number) {
    return this.#cachedLabels.getLabelById(listKey, id);
  }

  constructor() {
    this.paginator$ = this.#loadTimelines$();
  }

  #loadTimelines$(): Observable<LeadsPaginator> {
    return this.#page$.pipe(
      tap(() => this.loading.set(true)),
      switchMap(page =>
        this.#leadsService.getLeadTimeline(this.lead().id, page).pipe(
          map(data => ({
            items: data.data,
            page,
            hasMorePages: data.from + data.per_page < data.total,
          })),
        ),
      ),
      scan(this.#updatePaginator, { items: [], page: 0, hasMorePages: true }),
      tap(data => {
        const leadTimeline = data.items;
        this.#leadsService.setLeadTimeline(leadTimeline);
        this.loading.set(false);

        this.updateLists(leadTimeline);
      }),
    );
  }

  updateLists(items: LeadTimeline[]) {
    items.forEach(item => {
      switch (item.class) {
        case ITEM_CLASS_ACTIVITY:
          this.#cachedLists.updateLists([
            "activities:activity_outcomes",
            "activities:activity_sub_types",
          ]);
          break;
        case ITEM_CLASS_EVENT:
          this.#cachedLists.updateLists([
            "interests:interests",
            "tags:tags",
            "events:event_statuses",
            "events:event_types",
            "assignments:all_users_info",
            "interests:interests",
            "tags:tags",
          ]);
          break;
        case ITEM_CLASS_OPPORTUNITY:
          this.#cachedLists.updateLists([
            "pipelines:deal_pipeline_stages",
            "brokers:brokers",
            "interests:interests",
            "tags:tags",
            "assignments:all_users_info",
          ]);
          break;
        case ITEM_CLASS_TASK:
          this.#cachedLists.updateLists([
            "assignments:all_users_info",
            "tasks:statuses",
            "tasks:priorities",
          ]);
          break;
      }
    });
  }

  #updatePaginator(accumulator: LeadsPaginator, value: LeadsPaginator) {
    if (value.page === 1) return value;
    accumulator.items = [...accumulator.items, ...value.items];
    accumulator.page = value.page;
    accumulator.hasMorePages = value.hasMorePages;
    return accumulator;
  }

  public loadMoreTimelines(paginator: LeadsPaginator) {
    if (!paginator.hasMorePages) return;
    this.#page$.next(paginator.page + 1);
  }

  deleteTimeline(id: number) {
    this.#leadsService.leadTimeline.update(events => events.filter(i => i.object.id !== id));
  }
}
