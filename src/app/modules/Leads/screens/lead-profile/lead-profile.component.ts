import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  numberAttribute,
  signal,
} from "@angular/core";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { LccaPermissionsService } from "@modules/Leads/services/lcca-permissions.service";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { ITEM_LEAD, Lead } from "@modules/Leads/services/service-types";
import { PhonesComponent } from "@modules/Phones/components/phones/phones/phones.component";
import { Phone } from "@modules/Phones/services/service-types";
import { SocialAccount } from "@modules/SocialAccounts/services/service-types";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
  CachedListsService,
  InitialsPipe,
  LogsComponent,
  MediaListComponent,
  RandomColorPipe,
  SpinnerComponent,
} from "@shared";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MenuModule } from "primeng/menu";
import { TabViewModule } from "primeng/tabview";
import { TooltipModule } from "primeng/tooltip";
import { filter, of, switchMap, tap } from "rxjs";
import { LeadProfileHeaderComponent } from "../lead-profile-header/lead-profile-header.component";
import { LeadProfileInfoTabComponent } from "../lead-profile-info-tab/lead-profile-info-tab.component";
import { LeadSourcesTabComponent } from "../lead-sources-tab/lead-sources-tab.component";

@Component({
  selector: "app-lead-profile",
  standalone: true,
  imports: [
    NgClass,
    ButtonModule,
    TooltipModule,
    MenuModule,
    LeadProfileInfoTabComponent,
    LeadProfileHeaderComponent,
    InitialsPipe,
    TabViewModule,
    PhonesComponent,
    LeadSourcesTabComponent,
    SpinnerComponent,
    LogsComponent,
    TranslateModule,
    MediaListComponent,
    RandomColorPipe,
  ],
  templateUrl: "./lead-profile.component.html",
  styleUrl: "./lead-profile.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LeadProfileComponent {
  #leadsService = inject(LeadsService);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);
  #dialogRef = inject(DynamicDialogRef);
  #dialogConfig = inject(DynamicDialogConfig);
  #cachedLists = inject(CachedListsService);
  #lccaPermissions = inject(LccaPermissionsService);
  #translate = inject(TranslateService);

  editData$ = this.#dialogConfig.data || of(null);
  activeIndex = signal(0);

  lead = signal<Lead>({} as Lead);
  leadId = input(0, { transform: numberAttribute });
  withCloseButton = computed(() => !this.leadId());
  socialAccounts = signal<SocialAccount[] | null>(null);
  organization = signal<string | null>(null);
  campaign = signal<string | null>(null);

  ITEM_LEAD = ITEM_LEAD;

  constructor() {
    this.#router.events.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.#dialogRef && this.closeDialog();
      }
    });
  }

  #updateLeadLists(lead: Lead) {
    const lists = [
      "dynamic_list:statuses",
      "interests:interests",
      "tags:tags",
      "dynamic_list:lead_lists",
      "dynamic_list:lead_classifications",
      "dynamic_list:lead_qualities",
      "dynamic_list:company_sizes",
      "dynamic_list:ratings",
      "leads:types",
      "dynamic_list:contact_methods",
      "dynamic_list:wallets",
      "dynamic_list:account_types",
      "dynamic_list:sources",
      "dynamic_list:industries",
      "dynamic_list:jobs",
      "dynamic_list:departments",
      "assignments:leads_assignments_methods",
      "assignments:assignments_rules",
      "assignments:all_users_info",
      "assignments:users",
      "assignments:groups",
      "activities:activity_outcomes",
      "activities:activity_types_messages",
      "activities:activity_types_meetings",
      "internationalizations:countries_codes",
    ];

    lead.country_id &&
      lists.push(...["locations:countries:ids:null", `locations:regions:ids:${lead.country_id}`]);
    lead.region_id && lists.push(`locations:cities:ids:${lead.region_id}`);
    lead.city_id && lists.push(`locations:areas:ids:${lead.city_id}`);

    this.#cachedLists.updateLists(lists);
  }

  #updateLeadDetails(lead: Lead) {
    lead.social_accounts && this.socialAccounts.set(lead.social_accounts);
    if (lead.organization) {
      this.organization.set(lead.organization.organization);
      this.lead.update(oldLead => ({
        ...oldLead,
        organization_info: {
          label: lead.organization?.organization as string,
          value: lead.organization?.id as number,
        },
      }));
    }
    lead.recent_campaign && this.campaign.set(lead.recent_campaign.campaign_name);
  }

  lead$ = toObservable(this.leadId).pipe(
    switchMap(leadId => {
      if (leadId) {
        return this.#leadsService.getLeadDetails(leadId).pipe(
          tap(lead => {
            this.lead.set(lead);
            this.#updateLeadDetails(lead);
            this.#updateLeadLists(lead);
          }),
        );
      } else {
        return this.editData$.pipe(
          tap((lead: Lead) => {
            this.lead.set(lead);
            this.#updateLeadLists(lead);
          }),
          filter((lead: Lead) => this.leadDetails(lead).length > 0),
          switchMap((lead: Lead) =>
            this.#leadsService
              .getLeadDetails(lead?.id, this.leadDetails(lead), false)
              .pipe(tap(leadDetails => this.#updateLeadDetails(leadDetails))),
          ),
        );
      }
    }),
  );

  leadReadonly = toSignal(this.lead$, { initialValue: {} as Lead });

  leadDetails(lead: Lead): string[] {
    let details: string[] = [];

    lead?.has_social_accounts && details.push("social_accounts");
    lead?.organization_id && details.push("organization");
    lead?.campaign_id && details.push("recent_campaign");

    return details;
  }

  tabsItems = computed<MenuItem[]>(() => [
    {
      label: this.#translate.instant(_("info")),
      tooltip: this.#translate.instant(_("info")),
      icon: "fas fa-info-circle",
      index: 0,
    },
    // {
    //   label: "Todos",
    //   tooltip: "Todos",
    //   icon: "fas fa-clipboard-check",
    //   index: 1,
    // },
    /* {
      label: "Cases",
      tooltip: "Cases",
      icon: "fas fa-comment-alt",
      index: 2,
    }, */
    {
      label: this.#translate.instant(_("attachments")),
      tooltip: this.#translate.instant(_("attachments")),
      icon: "fas fa-paperclip",
      index: 3,
      badgeNumber: this.lead()?.media?.length,
    },
    /* {
      label: "campaigns",
      tooltip: "campaigns",
      icon: "fas fa-compass",
      index: 4,
    }, */
    {
      label: this.#translate.instant(_("sources")),
      tooltip: this.#translate.instant(_("sources")),
      icon: "fas fa-compass",
      index: 5,
    },
    // {
    //   label: "Assignees",
    //   tooltip: "Assignees",
    //   icon: "fas fa-users",
    //   index: 6,
    // },
    // {
    //   label: "Duplicates Info",
    //   tooltip: "Duplicates Info",
    //   icon: "fas fa-copy",
    //   index: 7,
    // },
    {
      label: this.#translate.instant(_("logs")),
      tooltip: this.#translate.instant(_("logs")),
      icon: "fas fa-history",
      index: 8,
    },
  ]);

  onPhoneAdded(phone: Phone) {
    this.lead.update(lead => ({ ...lead, phones: [...lead.phones, phone] }));
    this.updateLeadInList(this.lead());
  }

  updateLeadInList(lead: Lead) {
    this.#leadsService.updateLeadInList(lead);
  }

  checkPermission(name: string) {
    return this.#lccaPermissions.checkPermission(this.lead()?.lead_type_id, name);
  }

  closeDialog() {
    this.#dialogRef?.close();
  }
}
