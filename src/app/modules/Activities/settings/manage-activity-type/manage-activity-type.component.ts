import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivityTypesService } from "@modules/Activities/services/activity-types.service";
import { Activity, ActivityTypes } from "@modules/Activities/services/service-types";
import { Observable, map } from "rxjs";
import { IndexActivityTypeComponent } from "./type-activity/type-activity.component";

@Component({
  selector: "app-settings-manage-lead",
  standalone: true,
  templateUrl: "./manage-activity-type.component.html",
  styleUrl: "./manage-activity-type.component.scss",
  imports: [AsyncPipe, IndexActivityTypeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ManageActivityTypeComponent {
  #getActivityTypes = inject(ActivityTypesService);

  activityTypes$: Observable<ActivityTypes[]> = this.#getActivityTypes.activityTypesTypes().pipe(
    map(data => {
      const activityKeys = Object.keys(data.activity_types);
      return activityKeys.map(type_active_name => ({
        type_active_name,
        data: data.activity_types[type_active_name].flatMap((i: Activity) => [
          i,
          ...(i.outcomes || []),
        ]),
      }));
    }),
  );

  activityTypes = toSignal(this.activityTypes$, { initialValue: [] });
}
