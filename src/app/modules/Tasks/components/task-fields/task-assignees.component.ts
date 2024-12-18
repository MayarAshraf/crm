import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { ITask } from "@modules/Tasks/services/service-types";
import { TaskFieldsService } from "@modules/Tasks/services/task-fields.service";
import { AvatarListComponent, CachedListsService, PopupFormComponent, constants } from "@shared";

@Component({
  selector: "app-task-assignees",
  standalone: true,
  template: `
    <app-popup-form
      [fields]="fields()"
      [model]="model()"
      [endpoint]="constants.API_ENDPOINTS.updateTasksData"
      apiVersion="v2"
      [payload]="{
        id: task().id,
        update_type: 'assignees',
        update_value: model().assignees
      }"
      [isEditHovered]="false"
      btnStyleClass="w-2rem h-2rem text-xs border-circle bg-primary -ml-2 border-2 border-white p-0"
      tooltipPosition="left"
      [btnTooltip]="assignees().length ? 'Edit Assignees' : 'Enter Assignees'"
      (updateUi)="task.set($event)"
    >
      <span topForm class="block text-primary text-xs font-medium mb-3">
        {{ assignees().length ? "Edit assignees" : "Enter assignees" }}
      </span>
      @if (assignees().length) {
        <app-avatar-list [items]="assignees()" />
      }
    </app-popup-form>
  `,
  imports: [PopupFormComponent, AvatarListComponent],
  styles: `:host { font-size: 0 }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskAssigneesComponent {
  #taskFieldsService = inject(TaskFieldsService);
  #cachedLists = inject(CachedListsService);

  task = model.required<ITask>();

  constants = constants;

  assignees = computed(() => {
    const users = this.#cachedLists.loadLists().get("assignments:all_users_info");
    return (
      users?.filter((u: { value: number }) => this.task()?.assignees_ids?.includes(u.value)) || []
    );
  });

  model = computed(() => ({ assignees: this.task()?.assignees_ids }));
  fields = computed(() => [this.#taskFieldsService.getAssigneesField()]);
}
