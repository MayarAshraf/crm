export interface ModulesSettings {
  id: number;
  key: string;
  value: string;
  order: number;
  module: string;
  entity: string;
  font_awesome_class: string;
  parsley_validation: string;
  laravel_validation: string;
}

export enum ModuleSetting {
  LEADGENERATE = 'Lead Generation Module',
  LEAD = 'Leads Module',
  INTEGRATION = 'Integrations Module',
  HR = 'HR Module',
  CALENDER = 'Calendar Module',
  EVENTS = 'Events Module',
  ASSIGNMENT = 'Assignments Module',
  IVENTORY = 'Broker Inventory Module',
  OPPORTUNITIES = 'Opportunities Module',
  TASK = 'Tasks Module',
  ACTIVITIES = 'Activities Module'
};