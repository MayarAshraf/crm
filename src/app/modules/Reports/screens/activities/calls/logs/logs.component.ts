import { ChangeDetectionStrategy, Component } from "@angular/core";
import { log } from "@modules/Reports/Services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-index-logs",
  standalone: true,
  templateUrl: "./logs.component.html",
  imports: [ButtonModule, TooltipModule, TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexLogsComponent extends BaseIndexComponent<log> {
  ngOnInit() {
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: "reports-scheduler/logs" },
      indexTitle: "Logs",
      indexIcon: constants.icons.list,
      indexTableKey: "LOGS_KEY",
      columns: [
        {
          name: "created_at",
          title: "send At",
          searchable: false,
          orderable: true,
        },
        {
          name: "report_scheduler.report_name",
          title: "Report",
          searchable: true,
          orderable: false,
        },
        { name: "duration_from", title: "Duration From", searchable: true, orderable: false },
        { name: "duration_to", title: "Duration At", searchable: false, orderable: false },
        { name: "sent_to", title: "Sent To", searchable: false, orderable: false },
      ],
    };
  }
}
