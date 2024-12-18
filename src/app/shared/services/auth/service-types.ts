// Auth service types (Models/entities)
export interface LoginData {
  token: string;
  token_type: string;
  refresh_token: string;
  client_id: number;
  client_secret: string;
  expires_in: string;
  expires_at: string;
  user: User;
  app_data: AppData;
}

export interface AppData {
  permissions: string[];
}

export interface User {
  id: number;
  group: {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    description: string;
    is_hidden: number;
    created_at: string;
    created_by: number | null;
    updated_at: string;
    updated_by: number;
    deleted_at: string | null;
    deleted_by: number | null;
  };
  full_name: string;
  image: string;
  birthdate: string;
  username: string;
  email: string;
  mobile_number: string;
  job_title: string;
  last_assignment_date: string;
  assignment_round_robin_counter: number;
  gender: string;
  is_suspended: boolean;
  is_invoiced: boolean;
  in_gamification: boolean;
  allow_anonymous_call_logs: boolean;
  last_login_at: string;
  last_login_ip: string;
  connection_id: number | null;
  timezone: string;
  last_seen: string | null;
  google_accounts: any[];
  preferences: Preference[];
  force_call_log: number;
  created_at: string;
  updated_at: string;
  created_since: string;
  updated_since: string;
}

interface Preference {
  user_id: number;
  preference_id: number;
  value: string;
  created_at: string | null;
  created_by: number | null;
  updated_at: string | null;
  updated_by: number | null;
  deleted_at: string | null;
  deleted_by: number | null;
  slug: string;
}
