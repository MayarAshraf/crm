export interface Assignment {
  id: number;
  assignees: Assignee[];
}

export interface Assignee {
  id: number;
  full_name: string;
  imageUrl: string;
  job_title: string;
  created_at: string;
}
