import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BaseIndexComponent, TableWrapperComponent } from "@shared";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-lead-over-sources",
  standalone: true,
  imports: [DividerModule, TooltipModule, ButtonModule, TableWrapperComponent],
  templateUrl: "./lead-over-sources.component.html",
  styleUrl: "./lead-over-sources.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LeadOverSourcesComponent extends BaseIndexComponent<any> {
  ngOnInit() {
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: "" },
      indexTitle: "DayWork",
      indexIcon: "",
      indexTableKey: "DAYS_KEY",
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
