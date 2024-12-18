import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChild,
} from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { IActivity } from "@modules/Activities/services/service-types";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
  CachedLabelsService,
  constants,
  GlobalActionService,
  InplaceDescComponent,
  TimelineCardComponent,
} from "@shared";

@Component({
  selector: "app-activity-card",
  standalone: true,
  template: `
    <div class="relative">
      <div #deleteTarget class="confirm-target"></div>
      <app-timeline-card
        [value]="activity()"
        [subtitle]="getLabelById('activities:activity_outcomes', activity().outcome_id)"
        [moreOptions]="moreOptions"
      >
        <div header>
          @if (getLabelById("activities:activity_sub_types", activity().activity_type_id)) {
            {{ getLabelById("activities:activity_sub_types", activity().activity_type_id) }}
          } @else {
            <i class="pi pi-spin pi-spinner"></i>
          }
        </div>

        <div content>
          <app-inplace-input
            [(entity)]="activity"
            updateType="notes"
            [enterBtnLabel]="'enter_notes' | translate"
            [editBtnLabel]="'edit_note' | translate"
            [endpoint]="constants.API_ENDPOINTS.updateActivitiesData"
          />
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
  imports: [TimelineCardComponent, InplaceDescComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityCardComponent extends GlobalActionService {
  #cachedLabels = inject(CachedLabelsService);
  #translate = inject(TranslateService);

  activity = model.required<IActivity>();
  endpoint = input<string>("");
  onDelete = output<number>();
  constants = constants;

  deleteTarget = viewChild.required<ElementRef>("deleteTarget");

  moreOptions = [
    {
      label: this.#translate.instant(_("delete")),
      icon: "fas fa-trash-alt",
      command: () => {
        const target = this.deleteTarget().nativeElement;
        this.deleteAction(this.endpoint(), target, this.activity().id);
      },
    },
  ];

  getLabelById(listKey: string, id: number | null) {
    return this.#cachedLabels.getLabelById(listKey, id as number);
  }

  protected updateUi(): void {
    this.onDelete.emit(this.activity().id);
  }
}
