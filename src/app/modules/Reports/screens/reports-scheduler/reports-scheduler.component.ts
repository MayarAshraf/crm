import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { PermissionsService } from "@gService/permissions.service";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { ReportsSchedulerCuComponent } from "./reports-scheduler-cu.component";

@Component({
  selector: "app-reports-scheduler-index",
  standalone: true,
  templateUrl: "./reports-scheduler.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReportsSchedulerComponent extends BaseIndexComponent<
  any,
  ComponentType<ReportsSchedulerCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-scheduled-reports"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-scheduled-report"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-scheduled-report"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-scheduled-report"]),
    });

    this.dialogComponent = ReportsSchedulerCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "reports-scheduler",
        delete: "reports-scheduler/delete",
      },
      indexTitle: "Reports Scheduler",
      indexIcon: "fas fa-window-maximize",
      createBtnLabel: "Create Reports Scheduler",
      indexTableKey: "REPORTS_SCHEDULER_KEY",
      columns: [
        { name: "id", title: "#ID", searchable: false, orderable: true },
        { name: "report_name", title: "Report", searchable: true, orderable: true },
        { name: "repeat_type", title: "Repeated", searchable: true, orderable: true },
        { name: "recipients_string", title: "Recipients", searchable: true, orderable: true },
        { name: "creator.full_name", title: "Created By", searchable: false, orderable: false },
        {
          name: "created_at",
          title: "Created At",
          searchable: false,
          orderable: false,
        },
      ],
    };
  }
}
