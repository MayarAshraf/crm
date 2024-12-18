import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { PopupFormComponent } from "@shared";
import { DropdownModule } from "primeng/dropdown";
import { SkeletonModule } from "primeng/skeleton";
import { BaseActivityComponent } from "./base-activity.component";

@Component({
  selector: "app-meeting-activity",
  standalone: true,
  templateUrl: "./base-activity.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    TranslateModule,
    SkeletonModule,
    DropdownModule,
    FormsModule,
    PopupFormComponent,
  ],
})
export class MeetingActivityComponent extends BaseActivityComponent {
  constructor() {
    super();
    this.popupTitle.set("log_meeting_feedback");
    this.buttonTooltip.set("log_meeting_feedback");
  }

  override getIcons(): { [index: number]: string } {
    return { 11: "fas fa-handshake", 12: "fas fa-handshake", 18: "fas fa-handshake" };
  }

  override getColors(): { [index: number]: string } {
    return { 11: "#F5B212", 12: "#007bff", 18: "#17a2b8" };
  }
}
