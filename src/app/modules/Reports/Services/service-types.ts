export interface UserPerformance {
  id: number;
  group_id: number;
  group: { name: string };
  full_name: string;
  job_title: string;
  imageUrl: string;
  created_at: string;
  last_login_at: string;
}

export interface log {
  id: number;
  created_at: string;
  report_name: string;
  duration_from: { report_name: string };
  duration_to: string;
  sent_to: string;
}

export interface SystemLog {
  id: number;
  log_name: string;
  description: string;
  subject: string;
  subject_id: number;
  subject_type: string;
  created_at: string;
  causer_id: number;
  causer_name: string;
  log: Log[];
}

interface Log {
  id: number;
  named_changes: NamedChange[];
}

interface NamedChange {
  last_login_at?: { new: string; old: string };
  last_login_ip?: { new: string; old: string };
}

export class SearchAgentModel {
  users_ids: number[] | null;
  groups_ids: number[] | null;
  constructor() {
    this.users_ids = null;
    this.groups_ids = null;
  }
}

export class SearchOverallEventsModel {
  users_ids: number[] | null;
  groups_ids: number[] | null;
  constructor() {
    this.users_ids = null;
    this.groups_ids = null;
  }
}
