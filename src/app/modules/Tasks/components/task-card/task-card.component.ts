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
import { ITask } from "@modules/Tasks/services/service-types";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
  DateFormatterPipe,
  EntitySelectComponent,
  GlobalActionService,
  InplaceDescComponent,
  TimelineCardComponent,
  constants,
} from "@shared";
import { MenuItem } from "primeng/api";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";
import { TaskAssigneesComponent } from "../task-fields/task-assignees.component";

@Component({
  selector: "app-task-card",
  standalone: true,
  template: `
    <div class="relative">
      <div #deleteTarget class="confirm-target"></div>

      <app-timeline-card [value]="task()" [moreOptions]="moreOptions">
        <div header class="flex flex-wrap align-items-center column-gap-5 row-gap-2">
          {{ task().subject }}
          <p class="m-0">
            <span class="text-xs" [pTooltip]="'due_date' | translate" tooltipPosition="top">
              <span class="item-label capitalize font-medium text-700 inline-block mb-0"> At:</span>
              {{ task().due_date | dateFormatter: "absolute" }}
            </span>
          </p>
        </div>

        <div content>
          <app-inplace-input
            [(entity)]="task"
            [endpoint]="constants.API_ENDPOINTS.updateTasksData"
          />

          <p-divider styleClass="my-2"></p-divider>

          <div class="flex flex-wrap justify-content-end align-items-center gap-5">
            <app-entity-select
              [(entity)]="task"
              [endpoint]="constants.API_ENDPOINTS.updateTasksData"
              apiVersion="v2"
              listModule="tasks"
              listName="priorities"
              updateType="priority_id"
              placeholder="select_priority"
            />
            <app-entity-select
              [(entity)]="task"
              [endpoint]="constants.API_ENDPOINTS.updateTasksData"
              apiVersion="v2"
              listModule="tasks"
              listName="statuses"
              updateType="status_id"
              placeholder="select_status"
            />
            <app-task-assignees [(task)]="task"></app-task-assignees>
          </div>
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
    TooltipModule,
    DividerModule,
    EntitySelectComponent,
    TimelineCardComponent,
    TaskAssigneesComponent,
    DateFormatterPipe,
    InplaceDescComponent,
    TranslateModule,
  ],
})
export class TaskCardComponent extends GlobalActionService {
  #translate = inject(TranslateService);

  task = model.required<ITask>();
  endpoint = input<string>("");
  onDelete = output<number>();
  deleteTarget = viewChild.required<ElementRef>("deleteTarget");
  constants = constants;

  moreOptions: MenuItem[] = [
    {
      label: this.#translate.instant(_("delete")),
      icon: "fas fa-trash-alt",
      command: () => {
        const target = this.deleteTarget().nativeElement;
        this.deleteAction(this.endpoint(), target, this.task().id);
      },
    },
  ];

  protected updateUi(): void {
    this.onDelete.emit(this.task().id);
  }
}
