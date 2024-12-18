import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  model,
  signal,
  viewChild,
} from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { CallActivityComponent } from "@modules/Activities/components/call-activity.component";
import { MeetingActivityComponent } from "@modules/Activities/components/meeting-activity.component";
import { MessageActivityComponent } from "@modules/Activities/components/message-activity.component";
import {
  ActivityType,
  CreateActivityResponse,
  IActivity,
  ITEM_CLASS_ACTIVITY,
} from "@modules/Activities/services/service-types";
import { EventActionComponent } from "@modules/Events/components/event-action/event-action.component";
import { IEvent, ITEM_CLASS_EVENT } from "@modules/Events/services/service-types";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { ITEM_LEAD, Lead, LeadTimeline } from "@modules/Leads/services/service-types";
import { NotePopupComponent } from "@modules/Notes/components/note-popup/note-popup.component";
import { INote, ITEM_CLASS_NOTE } from "@modules/Notes/services/service-types";
import { OpportunityPopupComponent } from "@modules/Opportunities/components/opportunity-popup/opportunity-popup.component";
import {
  IOpportunity,
  ITEM_CLASS_OPPORTUNITY,
} from "@modules/Opportunities/services/service-types";
import { PhonePopupComponent } from "@modules/Phones/components/phone-popup/phone-popup.component";
import { Phone } from "@modules/Phones/services/service-types";
import { AccountPopupComponent } from "@modules/SocialAccounts/components/account-popup/account-popup.component";
import { SocialAccount } from "@modules/SocialAccounts/services/service-types";
import { TaskPopupComponent } from "@modules/Tasks/components/task-popup/task-popup.component";
import { ITEM_CLASS_TASK, ITask } from "@modules/Tasks/services/service-types";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CachedListsService, constants } from "@shared";
import { MenuItem, MenuItemCommandEvent } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConnectedOverlayScrollHandler } from "primeng/dom";
import { MenuModule } from "primeng/menu";
import { OverlayPanel, OverlayPanelModule } from "primeng/overlaypanel";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-lead-actions",
  standalone: true,
  templateUrl: "./lead-actions.component.html",
  styleUrls: ["./lead-actions.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    TooltipModule,
    MenuModule,
    OverlayPanelModule,
    OpportunityPopupComponent,
    EventActionComponent,
    TaskPopupComponent,
    NotePopupComponent,
    PhonePopupComponent,
    AccountPopupComponent,
    CallActivityComponent,
    MeetingActivityComponent,
    MessageActivityComponent,
    TranslateModule,
  ],
})
export class LeadActionsComponent {
  #leadsService = inject(LeadsService);
  #cachedLists = inject(CachedListsService);
  #translate = inject(TranslateService);

  lead = model.required<Lead>();
  socialAccounts = model<SocialAccount[] | null>(null);

  ITEM_LEAD = ITEM_LEAD;
  public activityType = ActivityType;

  currentAction = signal("");
  leadActionsOverlay = viewChild.required<OverlayPanel>("leadActionsOverlay");
  actionsMenuToggler = viewChild("actionsMenuToggler", { read: ElementRef });

  #leadActionHandler(event: MenuItemCommandEvent, action: string) {
    this.currentAction.set(action);

    this.currentAction() === "phone" &&
      this.#cachedLists.updateLists(["internationalizations:countries_codes"]);

    this.leadActionsOverlay()?.toggle(
      event.originalEvent,
      this.actionsMenuToggler()?.nativeElement,
    );
  }

  leadActions = signal<MenuItem[]>([
    {
      label: this.#translate.instant(_("set_new_meeting")),
      icon: constants.icons.calendar,
      command: (event: MenuItemCommandEvent) => this.#leadActionHandler(event, "meeting"),
    },
    {
      label: this.#translate.instant(_("add_new_deal")),
      icon: constants.icons.money,
      command: (event: MenuItemCommandEvent) => this.#leadActionHandler(event, "deal"),
    },
    {
      label: this.#translate.instant(_("new_task")),
      icon: constants.icons.check,
      command: (event: MenuItemCommandEvent) => this.#leadActionHandler(event, "task"),
    },
    {
      label: this.#translate.instant(_("new_note")),
      icon: "fas fa-sticky-note",
      command: (event: MenuItemCommandEvent) => this.#leadActionHandler(event, "note"),
    },
    {
      label: this.#translate.instant(_("new_phone")),
      icon: constants.icons.mobile,
      command: (event: MenuItemCommandEvent) => this.#leadActionHandler(event, "phone"),
    },
    {
      label: this.#translate.instant(_("new_contact_method")),
      icon: constants.icons.share,
      command: (event: MenuItemCommandEvent) => this.#leadActionHandler(event, "account"),
    },
  ]);

  // Keep overlay panel open on page scroll
  // https://github.com/primefaces/primeng/issues/11470
  ngOnInit(): void {
    if (!this.leadActionsOverlay()) return;
    this.leadActionsOverlay().bindScrollListener = () => {
      if (!this.leadActionsOverlay().scrollHandler) {
        this.leadActionsOverlay().scrollHandler = new ConnectedOverlayScrollHandler(
          this.leadActionsOverlay().target,
          () => {
            this.leadActionsOverlay().align();
          },
        );
      }
      this.leadActionsOverlay().scrollHandler?.bindScrollListener();
    };
  }

  onActivityAdded(responseData: CreateActivityResponse) {
    const activity = responseData.activity ?? (responseData as IActivity);

    const newActivityData: LeadTimeline = {
      class: ITEM_CLASS_ACTIVITY,
      object: activity,
    };

    if (responseData.task) {
      const newTaskData: LeadTimeline = {
        class: ITEM_CLASS_TASK,
        object: responseData.task,
      };
      this.#leadsService.appendEventToTimeline(newTaskData);
    }

    this.#leadsService.appendEventToTimeline(newActivityData);

    this.lead.update(l => ({ ...l, last_activity: activity }));
    this.#leadsService.updateLeadInList(this.lead());
    this.#cachedLists.updateLists(["activities:activity_sub_types"]);
  }

  onEventAdded(event: IEvent) {
    this.leadActionsOverlay().hide();
    const newData = { class: ITEM_CLASS_EVENT, object: event };
    this.#leadsService.appendEventToTimeline(newData as LeadTimeline);
  }

  onOpportunityAdded(opportunity: IOpportunity) {
    this.leadActionsOverlay().hide();
    const newData = { class: ITEM_CLASS_OPPORTUNITY, object: opportunity };
    this.#leadsService.appendEventToTimeline(newData as LeadTimeline);
    this.#cachedLists.updateLists(["pipelines:deal_pipeline_stages"]);
  }

  onTaskAdded(task: ITask) {
    this.leadActionsOverlay().hide();
    const newData = { class: ITEM_CLASS_TASK, object: task };
    this.#leadsService.appendEventToTimeline(newData as LeadTimeline);
  }

  onNoteAdded(note: INote) {
    this.leadActionsOverlay().hide();
    const newData = { class: ITEM_CLASS_NOTE, object: note };
    this.#leadsService.appendEventToTimeline(newData as LeadTimeline);
  }

  onPhoneAdded(phone: Phone) {
    this.leadActionsOverlay().hide();
    const phones = [...this.lead().phones, phone];
    const lead = { ...this.lead(), phones };
    this.lead.set(lead);
    this.#leadsService.updateLeadInList(lead);
  }

  onAccountAdded(account: SocialAccount) {
    this.leadActionsOverlay().hide();
    // this.lead.update(lead => ({ ...lead, has_social_accounts: 1 }));
    // this.socialAccounts.update(socialAccounts => [...(socialAccounts || []), account]);
  }
}
