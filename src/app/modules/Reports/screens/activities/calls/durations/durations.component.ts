import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReportsService } from "@modules/Reports/Services/get-report.service";
import { BaseIndexComponent, ChartLineComponent, ChartService, constants } from "@shared";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-durations",
  standalone: true,
  imports: [DividerModule, ChartLineComponent, ButtonModule, TooltipModule],
  templateUrl: "./durations.component.html",
  styleUrl: "./durations.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DurationsComponent extends BaseIndexComponent<any> {
  #report = inject(ReportsService);
  #chart = inject(ChartService);

  datasets!: { [key: string]: any }[];
  constants = constants;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);

    this.datasets = [
      {
        label: "call",
        data: [2, 1, 2, 3, 0, 0, 0],
        fill: false,
        borderDash: [5, 5],
        tension: 0.4,
        borderColor: documentStyle.getPropertyValue("--teal-500"),
      },
    ];

    // this.indexMeta = {
    //   ...this.indexMeta,
    //   endpoints: { index: "''" },
    //   indexTitle: "Durations",
    //   indexIcon: constants.icons.list,
    //   indexTableKey: "DURATION_KEY",
    //   columns: [
    //     {
    //       name: "created_at",
    //       title: "Name",
    //       searchable: false,
    //       orderable: true,
    //     },
    //     {
    //       name: "report_scheduler.report_name",
    //       title: "Call with Duration",
    //       searchable: true,
    //       orderable: false,
    //     },
    //     { name: "duration_from", title: "Total Duration", searchable: true, orderable: false },
    //     { name: "duration_to", title: "Avg.call Duration", searchable: false, orderable: false },
    //     { name: "sent_to", title: "Longest Call", searchable: false, orderable: false },
    //     { name: "sent_to", title: "Shortest Call", searchable: false, orderable: false },
    //   ],
    // };
  }
}
