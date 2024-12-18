import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { constants } from "@shared";
import { ButtonModule } from "primeng/button";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { TooltipModule } from "primeng/tooltip";

export interface notifications {
  label: string;
  created_since: string;
}
@Component({
  selector: "app-notifications-menu",
  standalone: true,
  templateUrl: "./notifications-menu.component.html",
  styleUrls: ["./notifications-menu.component.scss"],
  imports: [NgClass, ButtonModule, TooltipModule, OverlayPanelModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsMenuComponent {
  notificationsCount = 155;
  notifications: notifications[] = [];

  constants = constants;

  ngOnInit() {
    this.notifications = [
      {
        label: "File has been exported LEADS (2023-02-27 11:04:43)",
        created_since: "5min ago",
      },
      {
        label: "File has been exported LEADS (2023-02-27 11:04:43)",
        created_since: "5min ago",
      },
      {
        label: "File has been exported LEADS (2023-02-27 11:04:43)",
        created_since: "5min ago",
      },
      {
        label: "File has been exported LEADS (2023-02-27 11:04:43)",
        created_since: "5min ago",
      },
      {
        label: "File has been exported LEADS (2023-02-27 11:04:43)",
        created_since: "5min ago",
      },
      {
        label: "File has been exported LEADS (2023-02-27 11:04:43)",
        created_since: "5min ago",
      },
    ];
  }
}
