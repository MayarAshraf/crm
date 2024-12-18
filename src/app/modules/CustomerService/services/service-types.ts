import { ITEM_LEAD } from "@modules/Leads/services/service-types";
import { MediaFile } from "@shared";

export const ITEM_TICKET = "Modules\\CustomerService\\Ticket";

export class CaseTypeModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    type: string | null;
    description: string | null;
  }[];

  constructor(editData?: CaseTypeModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        type: null,
        description: null,
      },
    ];
  }
}
export class CaseOriginModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    origin: string | null;
    description: string | null;
  }[];

  constructor(editData?: CaseOriginModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        origin: null,
        description: null,
      },
    ];
  }
}

export class CasePriorityModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    priority: string | null;
    description: string | null;
  }[];

  constructor(editData?: CasePriorityModel) {
    this.order = editData?.order || null;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        priority: null,
        description: null,
      },
    ];
  }
}

export class CaseReasonModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    reason: string | null;
    description: string | null;
  }[];

  constructor(editData?: CaseReasonModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        reason: null,
        description: null,
      },
    ];
  }
}

export interface Case {
  id: number;
  case_type_id: number;
  case_origin_id: number;
  ticketable_type: number;
  ticketable_id: number;
  ticketable_info: { label: string; value: number } | null;
  pipeline_id: number;
  pipeline_stage_id: number;
  assignees_ids: number[];
  interests: number[];
  tags: number[];
  attachments: [];
  case_priority_id: number;
  case_reason_id: number;
  closed_at: string | null;
  closed_by: number | null;
  created_at: string;
  created_by: number;
  deleted_at: string | null;
  deleted_by: number | null;
  description: string;
  media: MediaFile[];
  solution: string;
  subject: string;
  ticketable_name: string;
  updated_at: string;
  updated_by: number;
}

export class CaseModel {
  id?: number;
  ticketable_type: string;
  ticketable_info: { label: string; value: number } | null;
  ticketable_id: number | null;
  pipeline_id: number | null;
  pipeline_stage_id: number | null;
  subject: string | null;
  case_type_id: number | null;
  case_priority_id: number | null;
  description: string | null;
  case_reason_id: number | null;
  case_origin_id: number | null;
  interests: number[] | null;
  tags: number[] | null;
  solution: string | null;
  assignment_rule: string | null;
  users: number[] | null;
  groups: number[] | null;
  media: MediaFile[] | null;

  constructor(editData?: Case) {
    this.ticketable_type = ITEM_LEAD;
    this.ticketable_info = editData?.ticketable_info || null;
    this.ticketable_id = editData?.ticketable_id || null;
    this.pipeline_id = editData?.pipeline_id || null;
    this.pipeline_stage_id = editData?.pipeline_stage_id || null;
    this.subject = editData?.subject || null;
    this.case_type_id = editData?.case_type_id || null;
    this.case_priority_id = editData?.case_priority_id || null;
    this.description = editData?.description || null;
    this.case_reason_id = editData?.case_reason_id || null;
    this.case_origin_id = editData?.case_origin_id || null;
    this.interests = editData?.interests || null;
    this.tags = editData?.tags || null;
    this.solution = editData?.solution || null;
    this.assignment_rule = null;
    this.users = editData?.assignees_ids || null;
    this.groups = null;
    this.media = editData?.media || null;
  }
}
