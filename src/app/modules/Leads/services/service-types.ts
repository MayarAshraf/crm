import { IActivity, ITEM_CLASS_ACTIVITY } from "@modules/Activities/services/service-types";
import { Assignment } from "@modules/Assignments/services/service-types";
import { IEvent, ITEM_CLASS_EVENT } from "@modules/Events/services/service-types";
import { Campaign } from "@modules/Marketing/services/service-types";
import { INote, ITEM_CLASS_NOTE } from "@modules/Notes/services/service-types";
import {
  IOpportunity,
  ITEM_CLASS_OPPORTUNITY,
} from "@modules/Opportunities/services/service-types";
import { Organization } from "@modules/Organizations/services/service-types";
import { Phone } from "@modules/Phones/services/service-types";
import { SocialAccount } from "@modules/SocialAccounts/services/service-types";
import { ITask, ITEM_CLASS_TASK } from "@modules/Tasks/services/service-types";
import { constants, MediaFile } from "@shared";

export const ITEM_LEAD = "Modules\\Leads\\Lead";

export enum TypeLeadFields {
  FULLCREATION = "is_full_creation_hidden",
  FASTCREATION = "is_fast_creation_hidden",
  FULLEDIT = "is_full_edit_hidden",
  FASTEDIT = "is_fast_edit_hidden",
  FULLVIEW = "is_full_view_hidden",
  ISREQUIRED = "is_required",
}

export interface TypeLead {
  id: number;
  type: string;
}

export interface leadFields {
  type_lead_name: string;
  data: ManageleadField[];
}

export interface ManageleadField {
  id: number;
  lead_type: string;
  lead_type_id: number;
  lead_field: string;
  is_full_creation_hidden: boolean;
  is_fast_creation_hidden: boolean;
  is_full_edit_hidden: boolean;
  is_fast_edit_hidden: boolean;
  is_full_view_hidden: boolean;
  is_required: boolean;
}

export interface UpdateLeadFieldModel {
  id: number;
  update_type: string;
  update_value: boolean;
}

export class LeadModel {
  salutation_id: number | null;
  suffix: string | null;
  first_name: string | "";
  middle_name: string | "";
  last_name: string | "";
  full_name: string | "";
  birthdate: string | null;
  gender: number;
  color: string | null;
  title: string | null;
  company: string | null;
  company_size_id: number | null;
  industry_id: number | null;
  contact_method_id: number | null;
  job_id: number | null;
  description: string | null;
  address: string | null;
  country_id: number;
  region_id: number | null;
  city_id: number | null;
  area_place_id: number | null;
  zip_code: string | null;
  national_id: number | null;
  passport_number: number | null;
  interests: number[] | null;
  tags: number[] | null;
  assignment_rule: string | null;
  assignment_rule_id: number | null;
  users: number[] | null;
  groups: number[] | null;
  phones: Phone[];
  social_accounts: SocialAccount[];
  is_cold_calls: "on" | "off";
  status_id: number | null;
  rating_id: number | null;
  source_id: number | null;
  wallet_id: number | null;
  lead_list_id: number | null;
  account_type_id: number | null;
  lead_classification_id: number | null;
  lead_quality_id: number | null;
  organization_id: number | null;
  organization_info: { label: string; value: number } | null;
  department_id: number | null;
  owner_id: number | null;
  campaign_id: number | null;
  lead_campaign_status_id: number | null;
  attachments: File[] | null;
  interests_ids?: number[];
  tags_ids?: number[];
  assignees_ids?: number[];
  lead_type_id?: number;
  creation_type?: number;
  media: MediaFile[] | null;

  constructor(editData?: LeadModel) {
    this.salutation_id = editData?.salutation_id || null;
    this.suffix = editData?.suffix || null;
    this.first_name = editData?.first_name || "";
    this.middle_name = editData?.middle_name || "";
    this.last_name = editData?.last_name || "";
    this.full_name = editData?.full_name || "";
    this.birthdate = editData?.birthdate || null;
    this.gender = editData?.gender ?? 1;
    this.color = editData?.color || null;
    this.title = editData?.title || null;
    this.company = editData?.company || null;
    this.company_size_id = editData?.company_size_id || null;
    this.industry_id = editData?.industry_id || null;
    this.contact_method_id = editData?.contact_method_id || null;
    this.job_id = editData?.job_id || null;
    this.description = editData?.description || null;
    this.address = editData?.address || null;
    this.country_id = editData?.country_id || constants.DEFAULT_COUNTRY_ID;
    this.region_id = editData?.region_id || null;
    this.city_id = editData?.city_id || null;
    this.area_place_id = editData?.area_place_id || null;
    this.zip_code = editData?.zip_code || null;
    this.national_id = editData?.national_id || null;
    this.passport_number = editData?.passport_number || null;
    this.interests = editData?.interests_ids ?? null;
    this.tags = editData?.tags_ids ?? null;
    this.assignment_rule = null;
    this.assignment_rule_id = null;
    this.users = editData?.assignees_ids || null;
    this.groups = null;
    this.phones = this.#mapPhones(editData?.phones) as Phone[];
    this.social_accounts = this.#mapSocialAccounts(editData?.social_accounts) as SocialAccount[];
    this.is_cold_calls = editData?.is_cold_calls ? "on" : "off";
    this.status_id = editData?.status_id || null;
    this.rating_id = editData?.rating_id || null;
    this.source_id = editData?.source_id || null;
    this.wallet_id = editData?.wallet_id || null;
    this.lead_list_id = editData?.lead_list_id || null;
    this.account_type_id = editData?.account_type_id || null;
    this.lead_classification_id = editData?.lead_classification_id || null;
    this.lead_quality_id = editData?.lead_quality_id || null;
    this.organization_id = editData?.organization_id || null;
    this.organization_info = editData?.organization_info || null;
    this.department_id = editData?.department_id || null;
    this.owner_id = editData?.owner_id || null;
    this.campaign_id = editData?.campaign_id || null;
    this.lead_campaign_status_id = editData?.lead_campaign_status_id || null;
    this.attachments = editData?.attachments || null;
    this.media = editData?.media || null;
  }

  #mapPhones(phones: Phone[] | undefined) {
    if (phones && phones.length) {
      return phones.map(phone => ({
        phone: phone.phone,
        country_code: phone.country_code,
        has_whatsapp: phone.has_whatsapp,
      }));
    } else {
      return [{ country_code: "EG", phone: null, has_whatsapp: 1 }];
    }
  }

  #mapSocialAccounts(accounts: SocialAccount[] | undefined) {
    if (accounts && accounts.length) {
      return accounts.map(account => ({
        account_type_id: account.account_type_id,
        social_account: account.social_account,
      }));
    } else {
      return [{ account_type_id: null, social_account: null }];
    }
  }
}

// leads paginator
export interface LeadsPaginator {
  items: LeadTimeline[];
  page: number;
  hasMorePages: boolean;
}

export interface Lead {
  id: number;
  has_social_accounts: 0 | 1 | null;
  social_accounts: SocialAccount[] | null;
  campaign_id: number | null;
  recent_campaign: Campaign | null;
  organization_id: number | null;
  organization: Organization | null;
  organization_info: { label: string; value: number } | null;
  internal_code: string;
  owner_id: number;
  lead_type_id: number;
  title: string;
  suffix: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  description: string;
  company: string;
  address: string;
  national_id: string;
  passport_number: string;
  zip_code: string;
  birthdate: string | null;
  gender: number;
  color: string;
  country_id: number;
  region_id: number;
  city_id: number;
  area_place_id: number;
  industry_id: number;
  company_size_id: number;
  contact_method_id: number;
  job_id: number;
  department_id: number;
  account_type_id: number;
  status_id: number;
  old_status_id: number;
  salutation_id: number;
  rating_id: number;
  source_id: number;
  wallet_id: number;
  lead_list_id: number;
  lead_classification_id: number;
  lead_quality_id: number;
  last_activity?: IActivity;
  is_duplicate: number;
  duplicate_with: number[];
  assignment_rule_id: number;
  generation_source: string;
  leadgen_id: string;
  form_id: string;
  page_id: string;
  ad_id: string;
  adgroup_id: string;
  is_cold_calls: number;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
  interests_ids: number[] | null;
  tags_ids: number[] | null;
  assignment: Assignment;
  assignees_ids: number[] | null;
  phones: Phone[];
  media: MediaFile[];
}

// lead timeline
export type ClassType =
  | typeof ITEM_CLASS_NOTE
  | typeof ITEM_CLASS_OPPORTUNITY
  | typeof ITEM_CLASS_EVENT
  | typeof ITEM_CLASS_TASK
  | typeof ITEM_CLASS_ACTIVITY;
export type ObjectType = INote | IOpportunity | IEvent | ITask | IActivity;

export interface LeadTimeline {
  class: ClassType;
  object: ObjectType;
}
