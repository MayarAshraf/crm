import { ChangeDetectionStrategy, Component, inject, input, model, output } from "@angular/core";
import { LccaPermissionsService } from "@modules/Leads/services/lcca-permissions.service";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { Lead } from "@modules/Leads/services/service-types";
import { SocialAccountsComponent } from "@modules/SocialAccounts/components/social-accounts.component";
import { SocialAccount } from "@modules/SocialAccounts/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import { EntitySelectComponent, PermissionsService, constants } from "@shared";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { LeadActionsComponent } from "./lead-actions/lead-actions.component";
import { MoreActionsComponent } from "./lead-actions/more-actions/more-actions.component";

@Component({
  selector: "app-lead-profile-header",
  standalone: true,
  template: `
    <div class="pt-3 pb-2 px-3">
      <div class="flex flex-wrap align-items-center justify-content-between gap-3">
        <div class="flex flex-wrap align-items-start gap-3">
          <h2 class="font-semibold capitalize text-lg line-height-2 my-0">
            <span class="lead-name">
              <span class="text-black">{{ lead().full_name || "Unnamed Lead" }}</span>
              @if (lead().is_cold_calls) {
                <span class="circle" [pTooltip]="'cold_calls' | translate"></span>
              }
            </span>
            <span class="block text-sm font-normal">
              {{ lead().title }}
              @if (lead().company) {
                at {{ lead().company }}
              }
            </span>
          </h2>
          @if (lead().has_social_accounts) {
            <app-social-accounts [(socialAccounts)]="socialAccounts" />
          }
        </div>

        <div class="flex align-items-center gap-1">
          <div class="flex align-items-center flex-wrap gap-2">
            <app-lead-actions [(lead)]="lead" [(socialAccounts)]="socialAccounts" />
            <app-entity-select
              [(entity)]="lead"
              [endpoint]="constants.API_ENDPOINTS.updateCustomDataNoPermission"
              apiVersion="v2"
              styleClass="primary-status-select"
              listModule="dynamic_list"
              listName="statuses"
              updateType="status_id"
              [placeholder]="'select_stage' | translate"
              (onChange)="leadsService.updateLeadInList($event)"
            />
            @if (
              checkPermission("update-??") ||
              checkPermission("delete-??") ||
              userPermission.hasPermission(constants.permissions["merge-leads"])
            ) {
              <app-more-actions [(lead)]="lead" [socialaccounts]="socialAccounts()" />
            }
          </div>

          @if (withCloseButton()) {
            <button
              pButton
              class="p-button-text p-button-plain p-button-rounded w-2rem h-2rem"
              (click)="closeDialog.emit()"
              icon="pi pi-times"
            ></button>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .lead-name {
      position: relative;
      .circle {
        position: absolute;
        top: 0;
        inset-inline-end: -10px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: var(--primary-color);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    TooltipModule,
    SocialAccountsComponent,
    LeadActionsComponent,
    MoreActionsComponent,
    EntitySelectComponent,
    TranslateModule,
  ],
})
export class LeadProfileHeaderComponent {
  leadsService = inject(LeadsService);
  #lccaPermissions = inject(LccaPermissionsService);
  userPermission = inject(PermissionsService);

  lead = model.required<Lead>();
  socialAccounts = model.required<SocialAccount[] | null>();
  withCloseButton = input(false);
  closeDialog = output();
  constants = constants;

  checkPermission(name: string) {
    return this.#lccaPermissions.checkPermission(this.lead().lead_type_id, name);
  }
}
