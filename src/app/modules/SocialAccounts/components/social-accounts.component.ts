import { ChangeDetectionStrategy, Component, model } from "@angular/core";
import { SocialAccount } from "@modules/SocialAccounts/services/service-types";
import { RangePipe } from "@shared";
import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-social-accounts",
  standalone: true,
  template: `
    @if (socialAccounts()?.length) {
      <ul class="list-none p-0 m-0 flex flex-wrap align-items-center gap-2">
        @for (account of socialAccounts(); track account.id) {
          <li>
            <a
              pButton
              class="p-button-text p-button-rounded text-xs w-1.5rem h-1.5rem p-0"
              [href]="account.social_account"
              target="_blank"
              [icon]="account.account_type.font_awesome_class"
              [pTooltip]="account.account_type.default_local.account_type"
              tooltipPosition="top"
            ></a>
          </li>
        }
      </ul>
    } @else {
      <div class="flex align-items-center gap-1">
        @for (i of [] | range: 4; track $index) {
          <p-skeleton size="1.5rem" shape="circle" />
        }
      </div>
    }
  `,
  imports: [ButtonModule, TooltipModule, SkeletonModule, RangePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialAccountsComponent {
  socialAccounts = model.required<SocialAccount[] | null>();
}
