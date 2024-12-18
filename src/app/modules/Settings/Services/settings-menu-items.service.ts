import { Injectable, computed, inject, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ReportsMenuItemsService } from "@modules/Reports/Services/reports-menu-items.service";
import { TranslateService } from "@ngx-translate/core";
import {
  CachedListsService,
  EnabledModuleService,
  KebabCasePipe,
  PermissionsService,
  PluralPipe,
  constants,
} from "@shared";
import { MenuItem } from "primeng/api";

@Injectable({
  providedIn: "root",
})
export class SettingsMenuItemsService {
  #cachedLists = inject(CachedListsService);
  #reportsMenuItems = inject(ReportsMenuItemsService).reportsMenuItems;
  #permissions = inject(PermissionsService);
  #enabledModules = inject(EnabledModuleService);
  #translate = inject(TranslateService);

  dynamicItems = computed<MenuItem[]>(() => {
    return [
      {
        label: this.#translate.instant(_("dynamic_lists")),
        visible: this.#enabledModules.hasModule(constants.modulesNames["Dynamic Lists Module"]),
        expanded: true,
        items: this.#cachedLists
          .loadLists()
          .get("dynamic_list:all")
          ?.map((item: { label: string; value: number }) => ({
            label: item.label,
            icon: "fa fa-minus",
            routerLink: `/dynamic-lists/${item.value}/${item.label}`,
            visible: this.#permissions.hasPermission(this.updateRulePermission(item.label)),
          })),
      },
    ];
  });

  updateRulePermission(item: string) {
    const kebabCase = new KebabCasePipe();
    const pluralaCase = new PluralPipe();
    const permissionCRUD = "index-" + pluralaCase.transform(kebabCase.transform(item));

    const slugPermission = permissionCRUD as keyof typeof constants.permissions;
    return constants.permissions[slugPermission];
  }

  sidebarMenuItems = signal([
    {
      label: this.#translate.instant(_("organizations")),
      tooltip: this.#translate.instant(_("organizations")),
      tooltipPosition: "right",
      icon: "fas fa-city",
      routerLink: "/organizations",
      routerLinkActiveOptions: { exact: true },
      visible:
        this.#enabledModules.hasModule(constants.modulesNames["Organizations Module"]) &&
        this.#permissions.hasPermission(constants.permissions["index-organizations"]),
    },
    {
      label: this.#translate.instant(_("cases")),
      tooltip: this.#translate.instant(_("cases")),
      tooltipPosition: "right",
      icon: "fas fa-comment-alt",
      routerLink: "/customer-service/cases",
      routerLinkActiveOptions: { exact: true },
      visible:
        this.#enabledModules.hasModule(constants.modulesNames["Customer Service Module"]) &&
        this.#permissions.hasPermission(constants.permissions["index-tickets"]),
    },
    // {
    //   label: "Contracts",
    //   tooltip: "Contracts",
    //   tooltipPosition: "right",
    //   icon: "fas fa-file-signature",
    // },
    // {
    //   label: "Brokers",
    //   tooltip: "Brokers",
    //   tooltipPosition: "right",
    //   icon: "fas fa-user-secret",
    // },
    {
      label: this.#translate.instant(_("check_ins")),
      tooltip: this.#translate.instant(_("check_ins")),
      tooltipPosition: "right",
      icon: "fas fa-map-location",
      routerLink: "/hr/check-ins/index",
      routerLinkActiveOptions: { exact: true },
      visible:
        this.#enabledModules.hasModule(constants.modulesNames["HR Module"]) &&
        this.#permissions.hasAnyPermissions([
          constants.permissions["index-hr-check-ins"],
          constants.permissions["index-hr-fake-incidents"],
        ]),
    },
    {
      label: this.#translate.instant(_("resources")),
      tooltip: this.#translate.instant(_("resources")),
      tooltipPosition: "right",
      icon: "fas fa-folder-open",
      routerLink: "/resources",
      routerLinkActiveOptions: { exact: true },
      visible:
        this.#enabledModules.hasModule(constants.modulesNames["Resources Module"]) &&
        this.#permissions.hasPermission(constants.permissions["index-resources"]),
    },
    {
      icon: "pi pi-ellipsis-h",
      label: this.#translate.instant(_("more")),
      tooltip: this.#translate.instant(_("more")),
      tooltipPosition: "right",
      items: [
        {
          label: this.#translate.instant(_("referrals")),
          tooltip: this.#translate.instant(_("referrals")),
          tooltipPosition: "right",
          icon: "fas fa-people-robbery",
          routerLink: "/referrals",
          routerLinkActiveOptions: { exact: true },
          visible:
            this.#enabledModules.hasModule(constants.modulesNames["Referrals Module"]) &&
            this.#permissions.hasPermission(constants.permissions["index-referrals"]),
        },
      ],
    },
    {
      styleClass: "control-position-item",
      icon: "fas fa-file-download",
      label: this.#translate.instant(_("exports")),
      tooltip: this.#translate.instant(_("exports")),
      tooltipPosition: "right",
      routerLink: "/exports/exports",
      routerLinkActiveOptions: { exact: true },
      visible:
        this.#enabledModules.hasModule(constants.modulesNames["Exports Module"]) &&
        this.#permissions.hasPermission(constants.permissions["index-exported-files"]),
    },
    {
      icon: "fas fa-circle-question",
      label: this.#translate.instant(_("help")),
      tooltip: this.#translate.instant(_("help")),
      tooltipPosition: "right",
      items: [
        {
          label: this.#translate.instant(_("help_support")),
          styleClass:
            "lg:block hidden text-primary letter-spacing-1 my-3 text-xl pointer-events-none",
        },
        {
          label: this.#translate.instant(_("help_center")),
          icon: "fas fa-circle-question",
        },
        {
          label: this.#translate.instant(_("support_portal")),
          icon: "fas fa-keyboard",
        },
        {
          label: this.#translate.instant(_("send_mail")),
          icon: "fas fa-at",
        },
        {
          label: this.#translate.instant(_("call_us")),
          icon: constants.icons.call,
          styleClass: "text-primary",
          // url: 'tel:01211888811',
          command: () => (window.location.href = "tel:01211888811"),
        },
      ],
    },
    {
      icon: "fas fa-cogs",
      label: this.#translate.instant(_("crm_settings")),
      tooltip: this.#translate.instant(_("crm_settings")),
      tooltipPosition: "right",
      routerLink: "/settings",
      routerLinkActiveOptions: { exact: true },
      visible:
        this.#enabledModules.hasModule(constants.modulesNames["Settings Module"]) &&
        this.#permissions.hasAnyPermissions(constants.settingsPermissions),
    },
  ]);

  startHeaderItems = signal([
    /* {
      icon: "fas fa-tachometer",
      label: "Dashboard",
      tooltip: "Dashboard",
      tooltipPosition: "right",
      routerLink: "/home",
      routerLinkActiveOptions: { exact: true },
      visible: this.#enabledModules.hasModule(constants.modulesNames["Dashboard Module"]),
    }, */
    {
      icon: "fas fa-briefcase",
      label: this.#translate.instant(_("workspace")),
      tooltip: this.#translate.instant(_("workspace")),
      tooltipPosition: "right",
      routerLink: "/leads/workspace",
      routerLinkActiveOptions: { exact: true },
      visible:
        this.#enabledModules.hasModule(constants.modulesNames["Leads Module"]) &&
        this.#permissions.hasAnyPermissions([
          constants.permissions["index-leads"],
          constants.permissions["index-contacts"],
          constants.permissions["index-customers"],
          constants.permissions["index-accounts"],
        ]),
    },
    {
      icon: "fas fa-money-bills",
      label: this.#translate.instant(_("deals")),
      tooltip: this.#translate.instant(_("deals")),
      tooltipPosition: "right",
      routerLink: "/opportunities",
      routerLinkActiveOptions: { exact: true },
      visible:
        this.#enabledModules.hasModule(constants.modulesNames["Opportunities Module"]) &&
        this.#permissions.hasPermission(constants.permissions["index-opportunities"]),
    },
    {
      icon: "fas fa-city",
      label: this.#translate.instant(_("inventory")),
      tooltip: this.#translate.instant(_("inventory")),
      tooltipPosition: "right",
      routerLink: "/broker-inventory/projects/index",
      routerLinkActiveOptions: { exact: true },
      visible: this.#enabledModules.hasModule(constants.modulesNames["Broker Inventory Module"]),
    },
    {
      icon: "fas fa-bullhorn",
      label: this.#translate.instant(_("marketing")),
      tooltip: this.#translate.instant(_("marketing")),
      tooltipPosition: "right",
      routerLink: "/marketing",
      routerLinkActiveOptions: { exact: true },
      visible:
        this.#enabledModules.hasModule(constants.modulesNames["Marketing Module"]) &&
        this.#permissions.hasPermission(constants.permissions["index-campaigns"]),
    },

    ...this.#reportsMenuItems(),
  ]);

  endHeaderItems = signal([
    {
      id: "todos-item",
      icon: "fas fa-clipboard-check",
      label: this.#translate.instant(_("todos")),
      tooltip: this.#translate.instant(_("todos")),
      tooltipPosition: "top",
      routerLink: "/calendar/todos",
      routerLinkActiveOptions: { exact: true },
    },
    /* {
      id: "calendar-item",
      icon: "far fa-calendar-alt",
      label: "Calendar",
      tooltip: "Calendar",
      tooltipPosition: "top",
      routerLink: "/calendar",
      routerLinkActiveOptions: { exact: true },
      visible: this.#enabledModules.hasModule(constants.modulesNames["Calendar Module"]),
    }, */
    {
      id: "duplicates-item",
      icon: "fas fa-copy",
      label: "Duplicates",
      tooltip: "Duplicates",
      tooltipPosition: "top",
      routerLink: "/leads/duplicates-manager",
      routerLinkActiveOptions: { exact: true },
    },
  ]);
}
