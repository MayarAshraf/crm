import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { SettingsMenuItemsService } from "@modules/Settings/Services/settings-menu-items.service";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-top-header-menu",
  standalone: true,
  template: `
    @if (endHeaderItems().length) {
      <div class="flex gap-3 align-items-center">
        @for (item of endHeaderItems(); track $index) {
          <a
            pButton
            [routerLink]="item.routerLink"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            [pTooltip]="item.tooltip"
            tooltipPosition="bottom"
            [icon]="item.icon"
            class="header-link w-2rem h-2rem transition-none shadow-none p-0 text-lg"
          ></a>
        }
      </div>
    }
  `,
  styles: `
    .header-link {
      &:hover,
      &.active-link {
        background-color: var(--highlight-text-color);
        border-color: var(--highlight-text-color);
      }
    }
  `,
  imports: [ButtonModule, TooltipModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopHeaderMenuComponent {
  #SettingsMenuItems = inject(SettingsMenuItemsService);
  endHeaderItems = this.#SettingsMenuItems.endHeaderItems;
}
