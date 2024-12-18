export const ITEM_CLASS_TASK = "Modules\\Tasks\\Task";

export interface ITask {
  id: number;
  assignees_ids: number[] | null;
  status_id: number;
  priority_id: number;
  subject: string;
  description: string;
  due_date: string;
  is_automated: number;
  taskable_type: string;
  taskable_id: number;
  type_id: number;
  created_at: string;
  created_by: number;
}

export class TaskModel {
  taskable_type: string;
  taskable_id: number;
  type_id: number | null;
  due_date: string | null;
  assignees: number[] | null;
  subject: string | null;
  description: string | null;
  status_id: number | null;
  priority_id: number | null;

  constructor(editData?: any) {
    this.taskable_type = editData?.type;
    this.taskable_id = editData?.id;
    this.type_id = 2;
    this.due_date = null;
    this.assignees = null;
    this.subject = null;
    this.description = null;
    this.status_id = 1;
    this.priority_id = 2;
  }
}
