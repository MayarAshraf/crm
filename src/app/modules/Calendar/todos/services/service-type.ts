export interface Todos {
  id: number;
  due_date: string;
  subject: string;
  description: string;
  status_id: number;
  status_name: string;
  priority_id: number;
  priority_name: string;
  type_id: number;
  type_name: string;
  assignees_string: string;
  assignees_ids: number[];
  taskable: Taskable;
  class: string;
}

export interface Taskable {
  id: number;
  name: string;
  full_name: string;
  status_id: number;
  status_name: string;
  lead_type_id: number;
  lead_type: string;
  phones: Phone[];
}

export interface Phone {
  phonable_id: number;
  country_code: string;
  format_E164: string;
  format_national: string;
}
