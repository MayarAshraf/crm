import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { PopupFormComponent } from "@shared";
import { DropdownModule } from "primeng/dropdown";
import { SkeletonModule } from "primeng/skeleton";
import { BaseActivityComponent } from "./base-activity.component";

@Component({
  selector: "app-message-activity",
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
export class MessageActivityComponent extends BaseActivityComponent {
  constructor() {
    super();
    this.popupTitle.set("log_a_message");
    this.buttonTooltip.set("log_a_message");
  }
  override getIcons(): { [index: number]: string } {
    return {
      5: "fa fa-envelope",
      6: "fab fa-whatsapp",
      7: "fa fa-comment-dots",
      8: "fab fa-skype",
      9: "fab fa-viber",
      19: "fab fa-facebook-messenger",
    };
  }

  override getColors(): { [index: number]: string } {
    return { 5: "#168de2", 6: "#00d757", 7: "#DC3545", 8: "#00aff0", 9: "#8f5db7", 19: "#0084ff" };
  }
}
