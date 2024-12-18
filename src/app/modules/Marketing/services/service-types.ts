import { MediaFile } from "@shared";

export const ITEM_CAMPAIGN = "Modules\\Marketing\\Campaign";

export interface Campaign {
  id: number;
  parent_id: any;
  campaign_type_id: number;
  campaign_status_id: number;
  currency_code: string;
  expected_revenue: number;
  actual_cost: number;
  budgeted_cost: number;
  expected_response: number;
  start_date: string;
  end_date: string;
  migration_id: any;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
  deleted_at: any;
  deleted_by: any;
  insights: Insights;
  tables_data: TablesData;
  default_campaign_name: string;
  campaign_name: string;
  default_description: string;
  description: string;
  attachments: any[];
  media: MediaFile[];
  translations: {
    language_id: number | null;
    campaign_name: string | null;
    description: string | null;
  }[];
}
export interface Insights {
  cost: Cost;
  leads: Leads;
  won_deals: WonDeals;
  open_deals: OpenDeals;
  roi: string;
  total_deals: number;
  cost_per_lead: number;
  cost_per_won_deal: number;
  cost_per_lost_deal: number;
  cost_per_deal: number;
  lost_deals_count: number;
  leads_over_stages: LeadsOverStage[];
}

export interface Cost {
  actual_cost: number;
  budgeted_cost: number;
  budgeted_percentage: number;
  budgeted_percentage_formatted: string;
}

export interface Leads {
  total: number;
  expected_response: number;
  expected_response_percentage: number;
  expected_response_percentage_formatted: string;
}

export interface WonDeals {
  totals: any[];
  count: number;
  won_deals_percentage: number;
  won_deals_percentage_formatted: string;
}

export interface OpenDeals {
  totals: any[];
  count: number;
  open_deals_percentage: number;
  open_deals_percentage_formatted: string;
}

export interface LeadsOverStage {
  status_id: number;
  count: number;
  cost: number;
  percentage: any;
}

export interface TablesData {
  leads: LeadsCampaign[];
  assignees: assignessCampaign[];
}

export interface LeadsCampaign {
  id: number;
  full_name: string;
  status_id: number;
  assignees_ids: number[];
  created_at: string;
}

export interface assignessCampaign {
  user_id: number;
  name: string;
  leads_count: number;
  deals_count: number;
  won_deals_count: number;
  open_deals_count: number;
  lost_deals_count: number;
}
export class CampaignModel {
  id?: number;
  campaign_type_id: number | null;
  campaign_status_id: number | null;
  expected_revenue: number | null;
  currency_code: string;
  expected_response: number | null;
  budgeted_cost: number | null;
  actual_cost: number | null;
  start_date: string | null;
  end_date: string | null;
  media: MediaFile[] | null;
  translations: {
    language_id: number | null;
    campaign_name: string | null;
    description: string | null;
  }[];

  constructor(editData?: CampaignModel) {
    this.campaign_type_id = editData?.campaign_type_id || null;
    this.campaign_status_id = editData?.campaign_status_id || null;
    this.budgeted_cost = editData?.budgeted_cost || null;
    this.expected_revenue = editData?.expected_revenue || null;
    this.currency_code = editData?.currency_code || "EGP";
    this.actual_cost = editData?.actual_cost || null;
    this.expected_response = editData?.expected_response || null;
    this.start_date = editData?.start_date || null;
    this.end_date = editData?.end_date || null;
    this.media = editData?.media || null;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        campaign_name: null,
        description: null,
      },
    ];
  }
}
export class CampaignTypeModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    campaign_type: string | null;
  }[];

  constructor(editData?: CampaignTypeModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        campaign_type: null,
      },
    ];
  }
}

export class CampaignStatusModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    campaign_status: string | null;
  }[];

  constructor(editData?: CampaignStatusModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations
      ? editData?.translations
      : [
          {
            language_id: 1,
            campaign_status: null,
          },
        ];
  }
}

export class LeadCampaignStatusModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    lead_campaign_status: string | null;
  }[];

  constructor(editData?: LeadCampaignStatusModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations
      ? editData?.translations
      : [
          {
            language_id: 1,
            lead_campaign_status: null,
          },
        ];
  }
}
