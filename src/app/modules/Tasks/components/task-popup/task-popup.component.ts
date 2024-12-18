import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { TaskModel } from "@modules/Tasks/services/service-types";
import { TaskFieldsService } from "@modules/Tasks/services/task-fields.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateModule } from "@ngx-translate/core";
import { BasePopupFormComponent, CachedListsService } from "@shared";

@Component({
  selector: "app-task-popup",
  standalone: true,
  template: `
    <app-base-popup-form
      [fields]="fields"
      [model]="model()"
      apiVersion="v2"
      endpoint="tasks/tasks/store"
      (updateUi)="onTaskAdded.emit($event)"
    >
      <span class="block mb-3 text-primary">
        {{ "new_task" | translate }}
        <span class="text-xs">({{ data()?.full_name }})</span>
      </span>
    </app-base-popup-form>
  `,
  imports: [BasePopupFormComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskPopupComponent {
  #taskFieldsService = inject(TaskFieldsService);
  #cachedLists = inject(CachedListsService);

  data = model.required<any>();
  taskableType = input<string>();
  onTaskAdded = output<any>();

  model = computed(() => new TaskModel({ id: this.data().id, type: this.taskableType() }));
  fields: FormlyFieldConfig[] = [];

  ngOnInit() {
    this.#cachedLists.updateLists([
      "tasks:types",
      "assignments:users",
      "tasks:statuses",
      "tasks:priorities",
    ]);
    this.fields = this.#taskFieldsService.configureFields();
  }
}
