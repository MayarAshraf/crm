import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { CachedLabelsService } from "@gService/cachedLabels.service";
import { IActivity } from "@modules/Activities/services/service-types";
import { IEvent } from "@modules/Events/services/service-types";
import { INote } from "@modules/Notes/services/service-types";
import { IOpportunity } from "@modules/Opportunities/services/service-types";
import { ITask } from "@modules/Tasks/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { MenuModule } from "primeng/menu";
import { TooltipModule } from "primeng/tooltip";
import { HighlightDirective } from "../directives";
import { DateFormatterPipe } from "../pipes";

@Component({
  selector: "app-timeline-card",
  standalone: true,
  template: `
    <div appHighlight>
      <span class="block line-height-1 mb-1 text-xs font-medium text-600">
        {{ value().created_at | dateFormatter }},
        {{ getLabelById("assignments:all_users_info", value().created_by) }}
      </span>

      <p-card styleClass="timeline-card bg-gray-100">
        <div class="flex justify-content-between align-items-center gap-3">
          <h4 class="font-normal text-900 m-0 flex align-items-center gap-3">
            <ng-content select="[header]"></ng-content>
            @if (subtitle()) {
              <small class="text-600">({{ subtitle() }})</small>
            }
          </h4>

          @if (showMoreOptions() && moreOptions().length) {
            <div>
              <button
                pButton
                type="button"
                (click)="menu.toggle($event)"
                icon="fas fa-ellipsis-vertical"
                [pTooltip]="'more' | translate"
                tooltipPosition="top"
                class="hover:border-1 hover:border-500 p-button-text p-button-rounded p-button-secondary w-2rem h-2rem"
              ></button>
              <p-menu #menu appendTo="body" [model]="moreOptions()" [popup]="true"> </p-menu>
            </div>
          }
        </div>
        <div class="mt-1">
          <ng-content select="[content]"></ng-content>
        </div>
      </p-card>
    </div>
  `,
  styles: `
    ::ng-deep {
      .timeline-card {
        --space: 15px;
        position: relative;
        box-shadow: none;
        border: 1px solid var(--gray-300);

        &::after {
          content: "";
          position: absolute;
          top: 15px;
          inset-inline-start: calc(calc(var(--space) / 2) * -1);
          width: var(--space);
          height: var(--space);
          background-color: var(--gray-100);
          border-left: 1px solid var(--gray-300);
          border-bottom: 1px solid var(--gray-300);
          transform: rotate(45deg);
          pointer-events: none;
        }

        .p-card-content {
          padding: 0.5rem 1rem;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardModule,
    MenuModule,
    ButtonModule,
    TooltipModule,
    HighlightDirective,
    DateFormatterPipe,
    TranslateModule,
  ],
})
export class TimelineCardComponent {
  #cachedLabels = inject(CachedLabelsService);
  value = input.required<IActivity | IEvent | INote | IOpportunity | ITask>();
  subtitle = input<string | number | null | undefined>();
  moreOptions = input<any[]>([]);
  showMoreOptions = input(true);

  getLabelById(listKey: string, id: number) {
    return this.#cachedLabels.getLabelById(listKey, id);
  }
}
