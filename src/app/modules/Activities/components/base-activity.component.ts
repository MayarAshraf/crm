import { Component, computed, inject, input, model, output, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CachedListsService, ListOption, localStorageSignal } from "@shared";
import { DropdownChangeEvent } from "primeng/dropdown";
import { Observable, map, tap } from "rxjs";
import { ActivityFieldsService } from "../services/activity-fields.service";
import { ActivityInputsService } from "../services/activity-inputs.service";
import {
  ActivityModel,
  ActivityType,
  CreateActivityResponse,
  IActivity,
} from "../services/service-types";

interface ActivityAction extends ListOption {
  icon: string;
  color: string;
  isDefault: boolean;
}

@Component({
  selector: "app-base-activity",
  template: "",
})
export class BaseActivityComponent {
  #cachedLists = inject(CachedListsService);
  #activityFieldsService = inject(ActivityFieldsService);
  #activityInputs = inject(ActivityInputsService);
  #translate = inject(TranslateService);

  data = model.required<any>();
  activitiableType = input.required<string>();
  activityType = input.required<string>();
  listKey = input.required<string>();
  onActivityAdded = output<CreateActivityResponse>();

  popupTitle = signal("");
  buttonTooltip = signal("");
  selectedActivityValue = signal(0);
  selectedActivityIcon = signal("");
  selectedActivityColor = signal("");
  isSelectedInboundActivity = signal(false);
  maxSubmissionCount = 10;
  outboundActivityId = 2;
  noAnswerValue = 2;
  inboundActivityId = 3;
  inboundOption = { label: "inbound", value: 99 }; // Assumed to be the last option (Hard coded)

  options$!: Observable<ActivityAction[]>;

  model = computed(() => {
    const baseModel = {
      ...new ActivityModel({ id: this.data().id, type: this.activitiableType() }),
    };

    switch (this.activityType()) {
      case ActivityType.LogMsg:
      case ActivityType.LogMeetingFeedback:
        return { ...baseModel, activity_type_id: this.selectedActivityValue() };
      case ActivityType.LogCall:
      default:
        return {
          ...baseModel,
          outcome_id: this.isSelectedInboundActivity() ? null : this.selectedActivityValue(),
          activity_type_id: this.isSelectedInboundActivity()
            ? this.inboundActivityId
            : this.outboundActivityId,
        };
    }
  });

  fields = computed(() => {
    return [
      this.#activityInputs.getActivityNoteField({
        expressions: {
          "props.required": () => this.selectedActivityValue() !== this.noAnswerValue,
        },
      }),
      ...this.#activityFieldsService.configureFields(),
    ];
  });

  ngOnInit() {
    this.#translate.instant(this.popupTitle());
    this.options$ = this.#cachedLists.getLists().pipe(
      map(options => {
        return this.activityType() === ActivityType.LogCall
          ? [...(options.get(this.listKey()) as ListOption[]), this.inboundOption]
          : options.get(this.listKey());
      }),
      map(options => this.#handleOptions(options as ListOption[])),
      tap(activities => {
        this.#initializeDefaultActivity(activities);
        if (this.activityType() === ActivityType.LogCall) {
          this.isSelectedInboundActivity.set(
            this.selectedActivityValue() === this.inboundOption.value,
          );
        }
        this.#sortActivities(activities);
        if (this.activityType() === ActivityType.LogCall) {
          // i know inbound what is value it is activities.length because when provide
          // inbound static i set value (options.get(this.listKey())?.length as number) + 1
          // i compare here this.selectedActivityValue() is equal activities.length here
          // i set this.isSelectedInboundActivity true to send inboundActivityId not outboundActivityId.

          this.isSelectedInboundActivity.set(this.selectedActivityValue() === activities.length);
        }
      }),
    );
  }

  // Abstract methods to be implemented by child components
  protected getIcons(): { [index: number]: string } {
    throw new Error("getIcons method must be implemented.");
  }

  protected getColors(): { [index: number]: string } {
    throw new Error("getColors method must be implemented.");
  }

  onActivityChanged(event: DropdownChangeEvent, options: ListOption[]) {
    const selectedActivity = options.find(item => item.value === event.value);
    this.isSelectedInboundActivity.set(selectedActivity?.value === this.inboundOption.value);
    event.originalEvent.stopPropagation();
  }

  updateUi(responseData: CreateActivityResponse) {
    this.onActivityAdded.emit(responseData);
    const activity = responseData.activity ?? (responseData as IActivity);

    this.options$
      .pipe(
        tap(activities => {
          const selectedActivity = activities?.find(a => {
            switch (this.activityType()) {
              case ActivityType.LogCall:
                return a.value === activity.outcome_id;
              case ActivityType.LogMsg:
              case ActivityType.LogMeetingFeedback:
                return a.value === activity.activity_type_id;
            }
          });
          if (selectedActivity) {
            this.#updateValues(selectedActivity);
            const submissionCount = this.#getSubmissionCount(selectedActivity?.value, 0);
            submissionCount.set((submissionCount() as number) + 1);
          }
        }),
      )
      .subscribe();
  }

  #updateValues(activity: ActivityAction) {
    this.selectedActivityIcon.set(activity?.icon);
    this.selectedActivityColor.set(activity?.color);
    this.selectedActivityValue.set(activity?.value);
  }

  #getSubmissionCount(activityId: number, value: number | null) {
    const key = `submission-count-${this.activityType()}-${activityId}-${this.data().id}`;
    return localStorageSignal<number | null>(value, key);
  }

  #handleOptions(options: ListOption[]): ActivityAction[] {
    return options?.map(option => {
      const icon = this.getIcons()[option.value];
      const color = this.getColors()[option.value];

      return {
        ...option,
        icon,
        color,
        isDefault: false,
      };
    });
  }

  #initializeDefaultActivity(activities: ActivityAction[]) {
    const defaultOption = activities?.find(o => {
      switch (this.activityType()) {
        case ActivityType.LogCall:
        case ActivityType.LogMeetingFeedback:
          return o.isDefault;
        case ActivityType.LogMsg:
          return o.value === 6;
      }
    });
    this.#updateValues(defaultOption || activities?.[0]);

    activities?.forEach(activity => {
      const submissionCount = this.#getSubmissionCount(activity.value, null);
      if ((submissionCount() as number) >= this.maxSubmissionCount) {
        this.#updateValues(activity);
      }
    });
  }

  #sortActivities(activities: ListOption[]) {
    return activities?.sort((a, b) =>
      a.value === this.selectedActivityValue()
        ? -1
        : b.value === this.selectedActivityValue()
          ? 1
          : 0,
    );
  }
}
