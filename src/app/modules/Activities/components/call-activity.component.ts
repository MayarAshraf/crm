import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { PopupFormComponent } from "@shared";
import { DropdownModule } from "primeng/dropdown";
import { SkeletonModule } from "primeng/skeleton";
import { BaseActivityComponent } from "./base-activity.component";

@Component({
  selector: "app-call-activity",
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
export class CallActivityComponent extends BaseActivityComponent {
  constructor() {
    super();
    this.popupTitle.set("log_a_call");
    this.buttonTooltip.set("log_a_call");
  }
  override getIcons(): { [index: number]: string } {
    return {
      1: "fas fa-phone",
      2: "fas fa-phone-slash",
      3: "fas fa-phone",
      4: "fas fa-phone",
      5: "fas fa-phone",
      6: "fas fa-phone",
      7: "fas fa-phone",
      8: "fas fa-phone",
      99: "fas fa-phone-volume", // 99 is hard coded value
    };
  }

  override getColors(): { [index: number]: string } {
    return {
      1: "#2D9BF0",
      2: "#F14724",
      3: "#DC3545",
      4: "#6C757D",
      5: "#DC3545",
      6: "#FFC107",
      7: "#007BFF",
      8: "#6C757D",
      99: "#2D9BF0", // 99 is hard coded value
    };
  }
}
