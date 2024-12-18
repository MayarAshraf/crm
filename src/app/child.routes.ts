import { Route } from "@angular/router";
import { AboutRoutes } from "@modules/About/about.routes";
import { activitiesRoutes } from "@modules/Activities/activities.routes";
import { automationRulesRoutes } from "@modules/Automation/automation.routes";
import { brokerInventoryRoutes } from "@modules/BrokerInventory/broker_inventory.routes";
import { brokersRoutes } from "@modules/Brokers/brokers.routes";
import { calendarRoutes } from "@modules/Calendar/calendar.routes";
import { companiesRoutes } from "@modules/Companies/companies.routes";
import { contractsRoutes } from "@modules/Contracts/contracts.routes";
import { customerServiceRoutes } from "@modules/CustomerService/customer-service.routes";
import { dashboardRoutes } from "@modules/Dashboard/dashboard.routes";
import { dynamicListsRoutes } from "@modules/DynamicLists/dynamic-lists.routes";
import { exportsRoutes } from "@modules/Exports/exports.routes";
import { groupsRoutes } from "@modules/Groups/groups.routes";
import { hrRoutes } from "@modules/HR/hr.routes";
import { importsRoutes } from "@modules/Imports/imports.routes";
import { interestsRoutes } from "@modules/Interests/interests.routes";
import { leadsRoutes } from "@modules/Leads/leads.routes";
import { locationsRoutes } from "@modules/Locations/locations.routes";
import { marketingRoutes } from "@modules/Marketing/marketing.routes";
import { opportunitiesRoutes } from "@modules/Opportunities/opportunities.routes";
import { organizationsRoutes } from "@modules/Organizations/organizations.routes";
import { PipelinesRoutes } from "@modules/Pipelines/pipelines.routes";
import { referralRoutes } from "@modules/Referrals/referrals.routes";
import { reportsRoutes } from "@modules/Reports/reports.routes";
import { resourcesRoutes } from "@modules/Resources/resources.routes";
import { settingsRoutes } from "@modules/Settings/settings.routes";
import { tagsRoutes } from "@modules/Tags/tags.routes";
import { usersRoutes } from "@modules/Users/users.routes";

export default [
  ...dashboardRoutes,
  ...activitiesRoutes,
  ...calendarRoutes,
  ...leadsRoutes,
  ...marketingRoutes,
  ...contractsRoutes,
  ...opportunitiesRoutes,
  ...AboutRoutes,
  ...settingsRoutes,
  ...interestsRoutes,
  ...tagsRoutes,
  ...importsRoutes,
  ...brokerInventoryRoutes,
  ...brokersRoutes,
  ...reportsRoutes,
  ...PipelinesRoutes,
  ...customerServiceRoutes,
  ...automationRulesRoutes,
  ...dynamicListsRoutes,
  ...groupsRoutes,
  ...locationsRoutes,
  ...usersRoutes,
  ...resourcesRoutes,
  ...companiesRoutes,
  ...exportsRoutes,
  ...hrRoutes,
  ...referralRoutes,
  ...organizationsRoutes,
] as Route[];
