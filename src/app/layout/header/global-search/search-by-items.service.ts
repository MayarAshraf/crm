import { computed, inject, Injectable, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateService } from "@ngx-translate/core";
import { EnabledModuleService, PermissionsService } from "@shared";
import { SelectItemGroup } from "primeng/api";

@Injectable({
  providedIn: "root",
})
export class SearchByItemsService {
  #userPermission = inject(PermissionsService);
  #enabledModule = inject(EnabledModuleService);
  #translate = inject(TranslateService);

  searchByItems = signal<SelectItemGroup[]>([]);
  selectedSearchItem = signal("mobile_number");
  searchTerm = signal<string | null>(null);

  constructor() {
    const groups = [
      this.#getLeadsGroup(),
      this.#getOrgsAndBrokersGroup(),
      this.#getInventoryGroup(),
      this.#getCustomerGroup(),
    ].filter(group => group !== null);

    this.searchByItems.set(groups as SelectItemGroup[]);
  }

  #getLeadsGroup() {
    if (
      this.#enabledModule.hasModule("Leads Module") &&
      this.#userPermission.hasAnyPermissions([
        "view-lead",
        "view-contact",
        "view-account",
        "view-customer",
      ])
    ) {
      return {
        label: this.#translate.instant(_("leads")),
        items: [
          { label: this.#translate.instant(_("mobile_number")), value: "mobile_number" },
          { label: this.#translate.instant(_("lead_id")), value: "lead_id" },
          { label: this.#translate.instant(_("lead_name")), value: "lead_name" },
          { label: this.#translate.instant(_("lead_comments")), value: "lead_comments" },
          { label: this.#translate.instant(_("national_id")), value: "national_id" },
          { label: this.#translate.instant(_("passport_number")), value: "passport_number" },
        ],
      };
    }
    return null;
  }

  #getBrokerGroup() {
    if (
      this.#enabledModule.hasModule("Brokers Module") &&
      this.#userPermission.hasPermission("view-broker-details")
    ) {
      return [{ label: this.#translate.instant(_("broker_name")), value: "broker_name" }];
    }
    return null;
  }

  #getOrganizationGroup() {
    if (
      this.#enabledModule.hasModule("Organizations Module") &&
      this.#userPermission.hasPermission("view-organization-details")
    ) {
      return [
        { label: this.#translate.instant(_("organization_id")), value: "organization_id" },
        { label: this.#translate.instant(_("organization_name")), value: "organization_name" },
      ];
    }
    return null;
  }

  #getOrgsAndBrokersGroup() {
    const orgGroup = this.#getOrganizationGroup();
    const brokerGroup = this.#getBrokerGroup();
    if (orgGroup && brokerGroup) {
      return {
        label: this.#translate.instant(_("organizations_and_brokers")),
        items: [...orgGroup, ...brokerGroup],
      };
    } else if (orgGroup) {
      return {
        label: this.#translate.instant(_("organizations")),
        items: [...orgGroup],
      };
    } else if (brokerGroup) {
      return {
        label: this.#translate.instant(_("brokers")),
        items: [...brokerGroup],
      };
    }
    return null;
  }

  #getInventoryGroup() {
    if (
      this.#enabledModule.hasModule("Broker Inventory Module") &&
      this.#userPermission.hasPermission("view-broker-inventory-unit")
    ) {
      return {
        label: this.#translate.instant(_("real_estate_inventory")),
        items: [
          { label: this.#translate.instant(_("unit_id")), value: "unit_id" },
          { label: this.#translate.instant(_("unit_code")), value: "unit_code" },
          { label: this.#translate.instant(_("project_id")), value: "project_id" },
          { label: this.#translate.instant(_("project_name")), value: "project_name" },
        ],
      };
    }
    return null;
  }

  #getCustomerGroup() {
    if (
      this.#enabledModule.hasModule("Customer Service Module") &&
      this.#userPermission.hasPermission("view-ticket-details")
    ) {
      return {
        label: this.#translate.instant(_("customer_service")),
        items: [
          { label: this.#translate.instant(_("tickets_id")), value: "tickets_id" },
          {
            label: this.#translate.instant(_("tickets_subject_desc")),
            value: "tickets_subject_desc",
          },
        ],
      };
    }
    return null;
  }

  placeholder = computed<string>(() => {
    switch (this.selectedSearchItem()) {
      case "mobile_number":
        return "e.g. 01XX XX XX XXX";
      case "lead_name":
        return "e.g. Mostafa Khaled";
      case "lead_comments":
        return "e.g. Will call him after...";
      case "lead_id":
        return "e.g. 334";
      case "national_id":
        return "e.g. 287XXXXXXXXXXX";
      case "passport_number":
        return "e.g. EGXXXXXXXXXXXX";
      case "organization_id":
        return "e.g. 123";
      case "organization_name":
        return "e.g. 8X Egypt";
      case "broker_name":
        return "e.g. Broker Company";
      case "unit_id":
        return "e.g. 776";
      case "unit_code":
        return "e.g. UNITXXXX";
      case "project_id":
        return "e.g. 65";
      case "project_name":
        return "e.g. Mivida";
      case "tickets_id":
        return "e.g. 5022";
      case "tickets_subject_desc":
        return "e.g. Customer Complaints";
      default:
        return this.#translate.instant(_("enter_search_query"));
    }
  });

  errorMessage = computed<string>(() => {
    switch (this.selectedSearchItem()) {
      case "mobile_number":
        return this.#translate.instant(_("please_enter_a_valid_mobile_number"));
      case "lead_id":
      case "project_id":
      case "unit_id":
      case "organization_id":
      case "tickets_id":
        return this.#translate.instant(_("please_enter_a_valid_id"));
      case "national_id":
        return this.#translate.instant(_("please_enter_a_valid_number"));
      default:
        return "";
    }
  });

  isValidTerm = computed(() => {
    switch (this.selectedSearchItem()) {
      case "mobile_number":
      case "lead_id":
      case "national_id":
      case "organization_id":
      case "unit_id":
      case "project_id":
      case "tickets_id":
        return /^\d+$/.test(this.searchTerm() as string);
      case "lead_name":
      case "lead_comments":
      case "passport_number":
      case "organization_name":
      case "broker_name":
      case "unit_code":
      case "project_name":
      case "tickets_subject_desc":
        return /^[a-zA-Z0-9\s\S]*$/.test(this.searchTerm() as string);
      default:
        return true;
    }
  });
}
