import { LowerCasePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, HostListener, input, signal } from "@angular/core";
import { Phone } from "@modules/Phones/services/service-types";
import { PhoneMaskPipe, PhoneNumberFormatterPipe, constants } from "@shared";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-phone-card",
  standalone: true,
  templateUrl: "./phone-card.component.html",
  styleUrls: ["./phone-card.component.scss"],
  imports: [
    LowerCasePipe,
    PhoneMaskPipe,
    CardModule,
    ButtonModule,
    TooltipModule,
    PhoneNumberFormatterPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneCardComponent {
  phone = input<Phone>({} as Phone);
  showFullNumber = signal(false);
  public constants = constants;

  @HostListener("mouseenter")
  onMouseEnter() {
    this.showFullNumber.set(true);
  }

  @HostListener("mouseleave")
  onMouseLeave() {
    this.showFullNumber.set(false);
  }

  makeCall(phoneNumber: string) {
    if (!this.showFullNumber) return;
    window.location.href = `tel:${phoneNumber}`;
  }
}
