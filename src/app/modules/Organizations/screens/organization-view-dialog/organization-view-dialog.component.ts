import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import IndexAddressesComponent from "@modules/Addresses/screens/index/addresses.component";
import { CasesTableComponent } from "@modules/CustomerService/screens/cases/components/cases-table/cases-table.component";
import LeadsTableComponent from "@modules/Leads/components/leads-table/leads-table.component";
import { NotesComponent } from "@modules/Notes/components/notes/notes.component";
import { OpportunitiesTableComponent } from "@modules/Opportunities/components/opportunities-table/opportunities-table.component";
import { ITEM_ORGANIZATION, Organization } from "@modules/Organizations/services/service-types";
import { PhonesComponent } from "@modules/Phones/components/phones/phones/phones.component";
import { Phone } from "@modules/Phones/services/service-types";
import { SocialAccountsComponent } from "@modules/SocialAccounts/components/social-accounts.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
  CachedLabelsService,
  CachedListsService,
  CommaSeparatedLabelsComponent,
  ConfirmService,
  constants,
  CopyButtonComponent,
  InitialsPipe,
  ListInfoComponent,
  MediaListComponent,
  PermissionsService,
  RandomColorPipe,
} from "@shared";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MenuModule } from "primeng/menu";
import { TabViewModule } from "primeng/tabview";
import { TimelineModule } from "primeng/timeline";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-organization-view-dialog",
  standalone: true,
  imports: [
    TabViewModule,
    ButtonModule,
    TooltipModule,
    MenuModule,
    CommaSeparatedLabelsComponent,
    ListInfoComponent,
    PhonesComponent,
    CasesTableComponent,
    CopyButtonComponent,
    InitialsPipe,
    NotesComponent,
    TimelineModule,
    SocialAccountsComponent,
    IndexAddressesComponent,
    LeadsTableComponent,
    OpportunitiesTableComponent,
    TranslateModule,
    MediaListComponent,
    RandomColorPipe,
  ],
  templateUrl: "./organization-view-dialog.component.html",
  styleUrl: "./organization-view-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationViewDialogComponent {
  #dialogConfig = inject(DynamicDialogConfig);
  #dialogRef = inject(DynamicDialogRef);
  #cachedLists = inject(CachedListsService);
  #userPermission = inject(PermissionsService);
  #confirmService = inject(ConfirmService);
  #cachedLabels = inject(CachedLabelsService);
  #translate = inject(TranslateService);

  activeIndex = signal(0);

  leadsList = [
    "dynamic_list:statuses",
    "dynamic_list:sources",
    "dynamic_list:ratings",
    "dynamic_list:lead_lists",
    "dynamic_list:lead_qualities",
    "dynamic_list:lead_classifications",
    "assignments:assignments_rules",
    "assignments:assignments_rules_types",
    "assignments:users",
    "assignments:all_users_info",
    "assignments:groups",
    "dynamic_list:wallets",
    "interests:interests",
    "tags:tags",
    "activities:activity_outcomes",
    "activities:activity_types_messages",
    "activities:activity_types_meetings",
  ];

  opportunityLists = [
    "pipelines:deal_pipelines",
    "interests:interests",
    "tags:tags",
    "pipelines:deal_pipeline_stages",
    "assignments:all_users_info",
  ];

  casesLists = [
    "customer_service:case_types",
    "customer_service:case_priorities",
    "pipelines:ticket_pipelines",
    "pipelines:tickets_pipeline_stages",
    "assignments:all_users_info",
  ];

  organization = signal(this.#dialogConfig.data.record);

  ITEM_ORGANIZATION = ITEM_ORGANIZATION;
  constants = constants;

  getLabelById(listKey: string, id: number) {
    return this.#cachedLabels.getLabelById(listKey, id);
  }

  getLabelsByIds(listKey: string, ids: number[]) {
    return this.#cachedLabels.getLabelsByIds(listKey, ids);
  }

  onTabClicked(index: number) {
    this.activeIndex.set(index);
    this.#cachedLists.updateLists(this.tabsItems()[index].lists);
  }

  ngOnInit() {
    this.#cachedLists.updateLists(this.leadsList);
  }

  tabsItems = computed<MenuItem[]>(() => [
    {
      label: this.#translate.instant(_("members")),
      slug: "members",
      tooltip: this.#translate.instant(_("members")),
      icon: "fas fa-user-tie",
      index: 0,
      lists: this.leadsList,
    },
    {
      label: this.#translate.instant(_("deals")),
      slug: "deals",
      tooltip: this.#translate.instant(_("deals")),
      icon: "fas fa-money-bills",
      index: 1,
      lists: this.opportunityLists,
    },
    {
      label: this.#translate.instant(_("referrals")),
      slug: "referrals",
      tooltip: this.#translate.instant(_("referrals")),
      icon: "fas fa-filter",
      index: 2,
      lists: this.leadsList,
    },
    {
      label: this.#translate.instant(_("addresses")),
      slug: "addresses",
      tooltip: this.#translate.instant(_("addresses")),
      icon: "fas fa-map-marker-alt",
      index: 3,
    },
    {
      label: this.#translate.instant(_("notes")),
      slug: "notes",
      tooltip: this.#translate.instant(_("notes")),
      icon: "fas fa-sticky-note",
      index: 4,
    },
    {
      label: this.#translate.instant(_("cases")),
      slug: "cases",
      tooltip: this.#translate.instant(_("cases")),
      icon: "fas fa-comment-alt",
      index: 5,
      lists: this.casesLists,
    },
    {
      label: "Attachments",
      slug: "attachments",
      tooltip: "Attachments",
      icon: "fas fa-paperclip",
      index: 6,
      badgeNumber: this.organization().media.length,
    },
  ]);

  moreOptions = [
    {
      label: this.#translate.instant(_("delete_organization")),
      icon: "fas fa-trash-alt",
      visible: this.#userPermission.hasPermission(constants.permissions["delete-organization"]),
      command: () => {
        this.#confirmService.confirmDelete({
          acceptCallback: () => {
            this.#dialogConfig.data.deleteRecord(this.organization());
            this.closeDialog();
          },
        });
      },
    },
    {
      label: this.#translate.instant(_("edit_organization")),
      icon: constants.icons.pencil,
      visible: this.#userPermission.hasPermission(constants.permissions["update-organization"]),
      command: () => {
        this.#dialogConfig.data.updateRecord(this.organization());
        this.closeDialog();
      },
    },
  ];

  ngOnDestroy() {
    this.closeDialog(this.organization());
  }

  closeDialog(data?: Organization) {
    this.#dialogRef.close(data);
  }

  onPhoneAdded(phone: Phone) {
    this.organization.update(organization => ({
      ...organization,
      phones: [...organization.phones, phone],
    }));
  }
}
