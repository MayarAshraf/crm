import { NgClass, NgTemplateOutlet, SlicePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, model, output } from "@angular/core";
import { Phone } from "@modules/Phones/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { CachedListsService } from "@shared";
import { ButtonModule } from "primeng/button";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { TooltipModule } from "primeng/tooltip";
import { PhonePopupComponent } from "../../phone-popup/phone-popup.component";
import { PhoneCardComponent } from "../phone-card/phone-card.component";

@Component({
  selector: "app-phones",
  standalone: true,
  template: `
    @if (phones() && phones().length) {
      <div
        class="flex flex-wrap gap-1"
        [ngClass]="{
          'align-items-end': layout() === 'vertical',
          'align-items-center': layout() === 'horizontal'
        }"
      >
        <div
          class="inline-flex flex-wrap align-items-center gap-1"
          [ngClass]="{
            'flex-column': layout() === 'vertical',
            'flex-row': layout() === 'horizontal'
          }"
        >
          @if (phones().length === 1) {
            <app-phone-card [phone]="phones()[0]" />
          } @else {
            @for (phone of phones() | slice: 0 : sliceCount(); track $index) {
              <app-phone-card [phone]="phone" />
            }
          }

          @if (showAllPhones()) {
            @for (phone of phones() | slice: sliceCount(); track $index) {
              <app-phone-card [phone]="phone" />
            }
          }

          @if (layout() === "horizontal") {
            <ng-container *ngTemplateOutlet="phonesActions" />
          }
        </div>
        @if (layout() === "vertical") {
          <ng-container *ngTemplateOutlet="phonesActions" />
        }
      </div>
    }

    <ng-template #phonesActions>
      @if (phones().length > sliceCount()) {
        <button
          pButton
          (click)="showAllPhones.set(!showAllPhones())"
          pTooltip="{{ showAllPhones() ? ('view_less' | translate) : ('view_more' | translate) }}"
          tooltipPosition="top"
          label="{{ showAllPhones() ? '-' : '+' }}{{ phones().length - sliceCount() }}"
          class="flex-shrink-0 p-button-link text-primary text-sm p-1"
        ></button>
      }

      @if (withCreateBtn()) {
        <p-button
          [outlined]="true"
          icon="pi pi-plus text-sm"
          [pTooltip]="'new_phone' | translate"
          tooltipPosition="top"
          styleClass="flex-shrink-0 text-primary w-2rem h-2rem p-0"
          (onClick)="addPhoneOverlay.toggle($event); loadCountriesCodes()"
        ></p-button>

        <p-overlayPanel #addPhoneOverlay>
          <app-phone-popup
            displayMode="popup"
            [phonableId]="phonableId()"
            [phonableType]="phonableType()"
            (onPhoneAdded)="onPhoneAdded.emit($event)"
          />
        </p-overlayPanel>
      }
    </ng-template>
  `,
  imports: [
    NgClass,
    SlicePipe,
    NgTemplateOutlet,
    ButtonModule,
    TooltipModule,
    PhoneCardComponent,
    PhonePopupComponent,
    OverlayPanelModule,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonesComponent {
  #cachedLists = inject(CachedListsService);

  phones = model.required<Phone[]>();
  layout = input<"vertical" | "horizontal">("horizontal");
  sliceCount = input(1);
  showAllPhones = model(false);
  withCreateBtn = input(true);

  phonableType = input<string>();
  phonableId = input<number>();
  onPhoneAdded = output<Phone>();

  loadCountriesCodes() {
    this.#cachedLists.updateLists(["internationalizations:countries_codes"]);
  }
}
