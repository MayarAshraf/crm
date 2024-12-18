import { ITEM_LEAD } from "@modules/Leads/services/service-types";

export const ITEM_CLASS_OPPORTUNITY = "Modules\\Opportunities\\Opportunity";

export interface IOpportunity {
  id: number;
  pipeline_id: number;
  pipeline_stage_id: number;
  currency_code: string;
  name: string;
  description: string | null;
  amount: number;
  close_date: string | null;
  closed_at: string | null;
  opportunitable_type: string;
  opportunitable_id: number;
  bi_unit_id: number | null;
  broker_id: number | null;
  commission: number | null;
  assignees_ids: number[];
  interests_ids: number[] | null;
  tags_ids: number[] | null;
  closed_by: number;
  created_at: string;
  created_by: number;
}

export class OpportunityModel {
  id?: number;
  opportunitable_type: string;
  opportunitable_id: number;
  opportunitable_info?: { label: string; value: number } | null;
  name: string | null;
  amount: number | null;
  currency_code: string;
  pipeline_id: number | null;
  pipeline_stage_id: number | null;
  close_date: string | null;
  closed_at: string | null;
  closed_by: number | null;
  description: string | null;
  interests: number[] | null;
  tags: number[] | null;
  assignees_ids: number[] | null;
  broker_id: number | null;
  broker_employee_ids: number[] | null;
  commission: number | null;
  bi_unit_id: number | null;
  bi_unit_info?: { label: string; value: number } | null;

  constructor(editData?: any) {
    this.id = editData?.id;
    this.opportunitable_type = editData?.opportunitable_type || ITEM_LEAD;
    this.opportunitable_id = editData?.opportunitable_id;
    this.opportunitable_info = editData?.opportunitable_info || null;
    this.name = editData?.name || null;
    this.amount = editData?.amount || null;
    this.currency_code = editData?.currency_code || "EGP";
    this.pipeline_id = editData?.pipeline_id || null;
    this.pipeline_stage_id = editData?.pipeline_stage_id || null;
    this.close_date = editData?.close_date || null;
    this.closed_at = editData?.closed_at || null;
    this.closed_by = editData?.closed_by || null;
    this.description = editData?.description || null;
    this.interests = editData?.interests_ids || null;
    this.tags = editData?.tags_ids || null;
    this.assignees_ids = editData?.assignees_ids || null;
    this.broker_id = editData?.broker_id || null;
    this.broker_employee_ids = editData?.broker_employee_ids || null;
    this.commission = editData?.commission || null;
    this.bi_unit_id = editData?.bi_unit_id || null;
    this.bi_unit_info = editData?.bi_unit_info || null;
  }
}

export class LostReasonModel {
  id?: number;
  order: number;
  translations: {
    language_id: number | null;
    value: string | null;
  }[];

  constructor(editData?: LostReasonModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        value: null,
      },
    ];
  }
}
