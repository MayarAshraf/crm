import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { StaticDataService } from "@shared";
import { ViewReportCardComponent } from "./components/view-report-card/view-report-card.component";
import { LayoutComponent } from "./screens/layout/layout.component";

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [RouterOutlet, RouterLink, LayoutComponent, ViewReportCardComponent],
  templateUrl: "./reports.component.html",
  styleUrl: "./reports.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReportsComponent {
  #staticData = inject(StaticDataService);
  activitiesItems = signal(this.#staticData.activityLinks);
}
