import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ModuleSetting } from "@modules/Settings/Services/service-types";
import { SettingsMenuItemsService } from "@modules/Settings/Services/settings-menu-items.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import {
  CachedListsService,
  DefaultScreenHeaderComponent,
  EnabledModuleService,
  MenuSearchItemsComponent,
  ModuleVisibilityDirective,
  PermissionsService,
  RangePipe,
  constants,
} from "@shared";
import { MenuItem } from "primeng/api";
import { CardModule } from "primeng/card";
import { PanelMenuModule } from "primeng/panelmenu";
import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: "app-settings-index",
  templateUrl: "./settings-index.component.html",
  styleUrls: ["./settings-index.component.scss"],
  standalone: true,
  imports: [
    ModuleVisibilityDirective,
    CardModule,
    SkeletonModule,
    MenuSearchItemsComponent,
    RangePipe,
    DefaultScreenHeaderComponent,
    PanelMenuModule,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsIndexComponent {
  #settingsMenuItems = inject(SettingsMenuItemsService);
  #cachedLists = inject(CachedListsService);
  #enabledModules = inject(EnabledModuleService);
  #userPermission = inject(PermissionsService);
  #translate = inject(TranslateService);

  constants = constants;
  settingsModule = this.#enabledModules.hasModule(constants.modulesNames["Settings Module"]);
  inventoryModule = this.#enabledModules.hasModule(
    constants.modulesNames["Broker Inventory Module"],
  );
  lookupsModule = this.#enabledModules.hasModule(constants.modulesNames["Lookups Module"]);
  dynamicItems = this.#settingsMenuItems.dynamicItems;

  settingsLabels = signal({
    general: this.#translate.instant(_("general")),
    automations: this.#translate.instant(_("automations")),
    inventory: this.#translate.instant(_("inventory")),
    lookups: this.#translate.instant(_("lookups")),
    modules: this.#translate.instant(_("modules")),
  });

  settingsGroups = computed(() => [
    {
      label: this.settingsLabels().general,
      icon: constants.icons.gear,
      items: this.#flattenStaticItems(this.general()),
    },
    {
      label: this.settingsLabels().automations,
      icon: constants.icons.robot,
      items: this.#flattenStaticItems(this.automations()),
    },
    {
      label: this.settingsLabels().lookups,
      icon: constants.icons.heart,
      items: [
        ...this.#flattenStaticItems(this.lookupsSettings()),
        ...((this.dynamicItems()[0] && this.dynamicItems()[0].items) || []),
      ],
    },
    {
      label: this.settingsLabels().inventory,
      icon: constants.icons.building,
      items: this.#flattenStaticItems(this.inventorySettings()),
    },
    {
      label: this.settingsLabels().modules,
      icon: constants.icons.thLarge,
      items: this.#flattenStaticItems(this.modulesAndMoreSettings()),
    },
  ]);
  ngOnInit() {
    this.#cachedLists.updateLists(["dynamic_list:all"]);
  }

  #flattenStaticItems(items: MenuItem[]): MenuItem[] {
    return items.flatMap(item => {
      // If the item has a routerLink, return it (wrapped in an array to work with flatMap).
      if (item.routerLink) return [item];
      // If the item has a nested 'items' array, flatten it recursively.
      if (item.items) return this.#flattenStaticItems(item.items);
      // If there is no routerLink, return an empty array to filter it out.
      return [];
    });
  }

  general = signal<MenuItem[]>([
    {
      icon: "fas fa-users",
      label: this.#translate.instant(_("users")),
      routerLink: "/users",
      visible: this.#userPermission.hasPermission(constants.permissions["index-users"]),
    },
    {
      icon: "fas fa-layer-group",
      label: this.#translate.instant(_("groups")),
      routerLink: "/groups",
      visible: this.#userPermission.hasPermission(constants.permissions["index-groups"]),
    },
    {
      icon: constants.icons.building,
      label: this.#translate.instant(_("companies")),
      routerLink: "/companies",
      visible: this.#enabledModules.hasModule(constants.modulesNames["Companies Module"]),
    },
    {
      icon: "fas fa-bars-staggered",
      label: this.#translate.instant(_("manage_pipelines")),
      routerLink: "/pipelines",
      visible:
        this.#userPermission.hasPermission(constants.permissions["index-pipelines"]) &&
        this.#enabledModules.hasModule(constants.modulesNames["Pipelines Module"]),
    },
  ]);

  automations = signal<MenuItem[]>([
    {
      icon: "fas fa-sync",
      label: this.#translate.instant(_("assignment_rules")),
      routerLink: "/imports/assignment-rules",
      visible:
        this.#userPermission.hasPermission(constants.permissions["index-assignment-rules"]) &&
        this.#enabledModules.hasModule(constants.modulesNames["Assignments Module"]),
    },
    {
      icon: "fab fa-facebook",
      label: this.#translate.instant(_("fblgi_routings")),
      routerLink: "/imports/fblgi-routings",
      visible: this.#userPermission.hasPermission(constants.permissions["index-fblgi-routings"]),
    },
    {
      icon: "fas fa-window-maximize",
      label: this.#translate.instant(_("web_form_routings")),
      routerLink: "/imports/web-form-routings",
      visible: this.#userPermission.hasPermission(constants.permissions["index-web-form-routings"]),
    },
    {
      icon: constants.icons.robot,
      label: this.#translate.instant(_("automation_rules")),
      routerLink: "/automation/rules",
      visible:
        this.#enabledModules.hasModule(constants.modulesNames["Automation Module"]) &&
        this.#userPermission.hasPermission(constants.permissions["index-automation-rules"]),
    },
    {
      icon: "fas fa-paper-plane",
      label: this.#translate.instant(_("reports_scheduler")),
      routerLink: "/reports/reports-scheduler",
      visible:
        this.#userPermission.hasPermission(constants.permissions["index-scheduled-reports"]) &&
        this.#enabledModules.hasModule(constants.modulesNames["Reports Scheduler Module"]),
    },
  ]);

  lookupsSettings = signal<MenuItem[]>([
    {
      icon: constants.icons.heart,
      label: this.#translate.instant(_("interests")),
      routerLink: "/interests",
      visible:
        this.#userPermission.hasPermission(constants.permissions["index-interests"]) &&
        this.#enabledModules.hasModule(constants.modulesNames["Interests Module"]),
    },
    {
      icon: constants.icons.tags,
      label: this.#translate.instant(_("tags")),
      routerLink: "/tags",
      visible:
        this.#userPermission.hasPermission(constants.permissions["index-tags"]) &&
        this.#enabledModules.hasModule(constants.modulesNames["Tags Module"]),
    },
    {
      icon: "fas fa-map-marker-alt",
      label: this.#translate.instant(_("locations")),
      routerLink: "/locations/settings",
      visible: this.#userPermission.hasPermission(constants.permissions["index-locations"]),
    },
    {
      icon: "fas fa-comments-dollar",
      label: this.#translate.instant(_("lost_reasons")),
      routerLink: "/opportunities/settings/lost-reasons",
      visible: this.#enabledModules.hasModule(constants.modulesNames["Opportunities Module"]),
    },
    {
      icon: "fas fa-file",
      label: this.#translate.instant(_("resource_types")),
      routerLink: "/resources/settings/types",
      visible:
        this.#userPermission.hasPermission(constants.permissions["index-resource-types"]) &&
        this.#enabledModules.hasModule(constants.modulesNames["Resources Module"]),
    },
    {
      label: this.#translate.instant(_("marketing")),
      visible: this.#enabledModules.hasModule(constants.modulesNames["Marketing Module"]),
      items: [
        {
          label: this.#translate.instant(_("campaign_types")),
          icon: "fas fa-minus",
          routerLink: "/marketing/settings/types",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-campaign-types"],
          ),
        },
        {
          label: this.#translate.instant(_("campaign_statuses")),
          icon: "fas fa-minus",
          routerLink: "/marketing/settings/statuses",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-campaign-statuses"],
          ),
        },
        {
          label: this.#translate.instant(_("lead_campaign_statuses")),
          icon: "fas fa-minus",
          routerLink: "/marketing/settings/lead-campaign-statuses",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-lead-campaign-statuses"],
          ),
        },
      ],
    },
    {
      label: this.#translate.instant(_("cases")),
      visible: this.#enabledModules.hasModule(constants.modulesNames["Customer Service Module"]),
      items: [
        {
          label: this.#translate.instant(_("case_reasons")),
          icon: "fas fa-minus",
          routerLink: "/customer-service/settings/case-reasons",
          visible: this.#userPermission.hasPermission(constants.permissions["view-case-reasons"]),
        },
        {
          label: this.#translate.instant(_("case_types")),
          icon: "fas fa-minus",
          routerLink: "/customer-service/settings/case-types",
          visible: this.#userPermission.hasPermission(constants.permissions["view-case-types"]),
        },
        {
          label: this.#translate.instant(_("case_origins")),
          icon: "fas fa-minus",
          routerLink: "/customer-service/settings/case-origins",
          visible: this.#userPermission.hasPermission(constants.permissions["view-case-origins"]),
        },
        {
          label: this.#translate.instant(_("case_priorities")),
          icon: "fas fa-minus",
          routerLink: "/customer-service/settings/case-priorities",
          visible: this.#userPermission.hasPermission(
            constants.permissions["view-case-priorities"],
          ),
        },
      ],
    },
  ]);

  inventorySettings = signal<MenuItem[]>([
    {
      icon: constants.icons.gear,
      label: this.#translate.instant(_("units_config")),
      routerLink: "/broker-inventory/settings/unit-config",
    },
    {
      icon: constants.icons.gear,
      label: this.#translate.instant(_("unit_requests_config")),
      routerLink: "/broker-inventory/settings/unit-requests",
      visible: this.#userPermission.hasPermission(
        constants.permissions["index-broker-inventory-unit-requests"],
      ),
    },
    {
      icon: constants.icons.gear,
      label: this.#translate.instant(_("unit_matching_request_config")),
      routerLink: "/broker-inventory/settings/unit-matching-request-config",
      visible: this.#userPermission.hasPermission(
        constants.permissions["update-broker-inventory-unit-request-matching-config"],
      ),
    },
    {
      label: this.#translate.instant(_("publish_times_about_sections")),
      icon: constants.icons.calendar,
      routerLink: "/about/sections",
      visible:
        this.#userPermission.hasPermission(constants.permissions["index-about-sections"]) &&
        this.#enabledModules.hasModule(constants.modulesNames["About Module"]),
    },
    {
      label: this.#translate.instant(_("more")),
      items: [
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("facilities")),
          routerLink: "/broker-inventory/settings/facilities",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-broker-inventory-facilities"],
          ),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("amenities")),
          routerLink: "/broker-inventory/settings/amenities",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-broker-inventory-amenities"],
          ),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("area_units")),
          routerLink: "/broker-inventory/settings/area-units",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-broker-inventory-area-units"],
          ),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("bathrooms")),
          routerLink: "/broker-inventory/settings/bathrooms",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-broker-inventory-bathrooms"],
          ),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("bedrooms")),
          routerLink: "/broker-inventory/settings/bedrooms",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-broker-inventory-bedrooms"],
          ),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("finishing_types")),
          routerLink: "/broker-inventory/settings/finishing-types",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-broker-inventory-finishing-types"],
          ),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("purposes")),
          routerLink: "/broker-inventory/settings/purposes",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-broker-inventory-purposes"],
          ),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("purpose_types")),
          routerLink: "/broker-inventory/settings/purpose-types",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-broker-inventory-purpose-types"],
          ),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("finishing_type")),
          routerLink: "/broker-inventory/settings/furnishing-statuses",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-broker-inventory-furnishing-statuses"],
          ),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("offering_types")),
          routerLink: "/broker-inventory/settings/offering-types",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-broker-inventory-offering-types"],
          ),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("payment_methods")),
          routerLink: "/broker-inventory/settings/payment-methods",
          visible:
            this.#userPermission.hasPermission(
              constants.permissions["index-broker-inventory-payment-methods"],
            ) && this.#enabledModules.hasModule(constants.modulesNames["Payments Module"]),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("positions")),
          routerLink: "/broker-inventory/settings/positions",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-broker-inventory-positions"],
          ),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("views")),
          routerLink: "/broker-inventory/settings/views",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-broker-inventory-views"],
          ),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("floor_numbers")),
          routerLink: "/broker-inventory/settings/floor-numbers",
          visible: this.#userPermission.hasPermission(
            constants.permissions["index-broker-inventory-floor-numbers"],
          ),
        },
      ],
    },
  ]);

  modulesAndMoreSettings = signal<MenuItem[]>([
    {
      icon: "fas fa-minus",
      label: this.#translate.instant(_("leads_fields_config")),
      routerLink: "/leads/settings/manage-lead-fields",
      visible: this.#enabledModules.hasModule(constants.modulesNames["Leads Module"]),
    },
    {
      label: this.#translate.instant(_("activity_type_config")),
      icon: constants.icons.pencil,
      routerLink: "/activity/settings/activity-type",
      visible: this.#enabledModules.hasModule(constants.modulesNames["Activities Module"]),
    },
    {
      icon: "fas fa-fingerprint",
      label: this.#translate.instant(_("system_logs")),
      routerLink: "/settings/system-logs",
      visible: this.#enabledModules.hasModule(constants.modulesNames["Logger Module"]),
    },
    {
      label: this.#translate.instant(_("technical_documentations")),
      icon: "fas fa-book",
      items: [
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("web_form_lead_generation_documentation")),
          routerLink: "/settings/documentations/search-leads-documentation",
          visible:
            this.#userPermission.hasPermission(
              constants.permissions["access-web-form-routings-technical-documentation"],
            ) && this.#enabledModules.hasModule(constants.modulesNames["Lead Generation Module"]),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("store_call_documentation")),
          routerLink: "/settings/documentations/store-client-documentation",
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("store_note_documentation")),
          routerLink: "/settings/documentations/store-note-documentation",
          visible: this.#enabledModules.hasModule(constants.modulesNames["Notes Module"]),
        },
        {
          label: this.#translate.instant(_("search_leads_documentation")),
          icon: "fas fa-minus",
          routerLink: "/settings/documentations/search-leads-documentation",
          visible: this.#enabledModules.hasModule(constants.modulesNames["Leads Module"]),
        },
      ],
    },
    {
      label: this.#translate.instant(_("manage_global_settings")),
      items: [
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("Lead Generation Module")),
          routerLink: `/settings/manage-global-settings/${ModuleSetting.LEADGENERATE}`,
          visible: this.#enabledModules.hasModule(constants.modulesNames["Lead Generation Module"]),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("Integrations Module")),
          routerLink: `/settings/manage-global-settings/${ModuleSetting.INTEGRATION}`,
          visible: this.#enabledModules.hasModule(constants.modulesNames["Integrations Module"]),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("Leads Module")),
          routerLink: `/settings/manage-global-settings/${ModuleSetting.LEAD}`,
          visible: this.#enabledModules.hasModule(constants.modulesNames["Leads Module"]),
        },
        {
          label: this.#translate.instant(_("HR Module")),
          icon: "fas fa-minus",
          routerLink: `/settings/manage-global-settings/${ModuleSetting.HR}`,
          visible: this.#enabledModules.hasModule(constants.modulesNames["HR Module"]),
        },
        {
          label: this.#translate.instant(_("Calendar Module")),
          icon: "fas fa-minus",
          routerLink: `/settings/manage-global-settings/${ModuleSetting.CALENDER}`,
          visible: this.#enabledModules.hasModule(constants.modulesNames["Calendar Module"]),
        },
        {
          label: this.#translate.instant(_("Events Module")),
          icon: "fas fa-minus",
          routerLink: `/settings/manage-global-settings/${ModuleSetting.EVENTS}`,
          visible: this.#enabledModules.hasModule(constants.modulesNames["Events Module"]),
        },
        {
          label: this.#translate.instant(_("Assignments Module")),
          icon: "fas fa-minus",
          routerLink: `/settings/manage-global-settings/${ModuleSetting.ASSIGNMENT}`,
          visible: this.#enabledModules.hasModule(constants.modulesNames["Assignments Module"]),
        },
        {
          label: this.#translate.instant(_("Broker Inventory Module")),
          icon: "fas fa-minus",
          routerLink: `/settings/manage-global-settings/${ModuleSetting.IVENTORY}`,
          visible: this.#enabledModules.hasModule(
            constants.modulesNames["Broker Inventory Module"],
          ),
        },
        {
          label: this.#translate.instant(_("Opportunities Module")),
          icon: "fas fa-minus",
          routerLink: `/settings/manage-global-settings/${ModuleSetting.OPPORTUNITIES}`,
          visible: this.#enabledModules.hasModule(constants.modulesNames["Opportunities Module"]),
        },
        {
          label: this.#translate.instant(_("Tasks Module")),
          icon: "fas fa-minus",
          routerLink: `/settings/manage-global-settings/${ModuleSetting.TASK}`,
          visible: this.#enabledModules.hasModule(constants.modulesNames["Tasks Module"]),
        },
        {
          icon: "fas fa-minus",
          label: this.#translate.instant(_("Activities Module")),
          routerLink: `/settings/manage-global-settings/${ModuleSetting.ACTIVITIES}`,
          visible: this.#enabledModules.hasModule(constants.modulesNames["Activities Module"]),
        },
      ],
    },
  ]);
}
