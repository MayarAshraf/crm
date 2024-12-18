import { Group } from "@modules/Groups/services/service-types";

export interface FilterManger {
  id: number;
  saved_filter: string;
  shared_with: string[];
  creator_name: string;
  created_at: string;
}

export class UserSmsBalanceModel {
  id: number | undefined;
  operation_type: number | null;
  sms_balance_sheet_id: number | null;
  amount: number | null;
  constructor(editData?: UserSmsBalanceModel) {
    this.id = editData?.id;
    this.operation_type = null;
    this.sms_balance_sheet_id = null;
    this.amount = null;
  }
}

export class SuspendUserModel {
  id: number | undefined;
  assignment_rule_leads: string | null;
  users_leads: number[] | null;
  constructor(editData?: SuspendUserModel) {
    this.id = editData?.id;
    this.assignment_rule_leads = null;
    this.users_leads = null;
  }
}

export class UserModel {
  full_name: string | null;
  job_title: string | null;
  email: string | null;
  mobile_number: string | null;
  username: string | null;
  password: string | null;
  password_confirmation: string | null;
  gender: 1 | 2 | null;
  birthdate: string | null;
  image: string | null;
  group_id: number | null;
  timezone: string;
  in_gamification: 0 | 1;
  in_activities: 0 | 1;
  in_events: 0 | 1;
  in_opportunities: 0 | 1;
  allow_anonymous_call_logs: 0 | 1;

  constructor(editData?: UserEditModel) {
    this.full_name = editData?.full_name || null;
    this.job_title = editData?.job_title || null;
    this.email = editData?.email || null;
    this.mobile_number = editData?.mobile_number || null;
    this.password = editData?.password || null;
    this.password_confirmation = editData?.password_confirmation || null;
    this.username = editData?.username || null;
    this.gender = editData?.gender || null;
    this.birthdate = editData?.birthdate || null;
    this.image = editData?.imageUrl || null;
    this.group_id = editData?.group_id || null;
    this.timezone = editData?.timezone || "Africa/Cairo";
    this.in_gamification = editData?.in_gamification || 1;
    this.in_activities = editData?.in_activities || 1;
    this.in_events = editData?.in_events || 1;
    this.in_opportunities = editData?.in_opportunities || 1;
    this.allow_anonymous_call_logs = editData?.allow_anonymous_call_logs || 1;
  }
}

export interface UserEditModel {
  full_name: string | null;
  job_title: string | null;
  email: string | null;
  mobile_number: string | null;
  username: string | null;
  password: string | null;
  password_confirmation: string | null;
  gender: 1 | 2 | null;
  birthdate: string | null;
  imageUrl: string | null;
  group_id: number | null;
  timezone: string;
  in_gamification: 0 | 1;
  in_activities: 0 | 1;
  in_events: 0 | 1;
  in_opportunities: 0 | 1;
  allow_anonymous_call_logs: 0 | 1;
}

export interface User {
  id: number;
  group: Group;
  full_name: string;
  image: string;
  username: string;
  email: string;
  mobile_number: string;
  job_title: string;
  last_seen: null;
  connection_id: null;
}

export interface Preference {
  user_id: number;
  preference_id: number;
  value: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  slug: string;
}

export interface UserPreference {
  id: number;
  default: string;
  name: string;
  description: string;
  options: string;
  slug: string;
  is_hidden: number;
}
