import { ITask } from "@modules/Tasks/services/service-types";
export const ITEM_CLASS_ACTIVITY = "Modules\\Activities\\Activity";

export interface CreateActivityResponse {
  activity?: IActivity;
  task?: ITask;
}

export interface IActivity {
  id: number;
  activity_type_id: number;
  outcome_id: number | null;
  notes: string;
  duration: number | null;
  started_at: string | null;
  platform_id: number | null;
  is_automated: number;
  is_auto_updated: number;
  activitiable_type: string;
  activitiable_id: number;
  releated_event_id: number | null;
  created_at: string;
  created_by: number;
}

export enum ActivityType {
  LogCall = "log-call",
  LogMsg = "log-msg",
  LogMeetingFeedback = "log-meeting-feedback",
}

export interface ActivityTypes {
  type_active_name: string;
  data: Activity[];
}

export interface Activity {
  id: number;
  order: number;
  is_default: boolean;
  name: string;
  outcomes: Outcome[];
  is_notes_shown: boolean;
  is_notes_required: boolean;
  is_outcome_id_shown: boolean;
  is_outcome_id_required: boolean;
  is_type_notes_required?: number;
  is_type_notes_shown?: number;
  font_awesome_class: string;
}

export interface Outcome {
  id: number;
  order: number;
  name: string;
  is_type_notes_required: number;
  is_type_notes_shown: number;
}

export interface UpdateActivityTypeModel {
  id: number;
  update_type: string;
  update_value: boolean | number;
}

export class ActivityModel {
  activitiable_type: string;
  activitiable_id: number;
  activity_type_id: number | null;
  notes: string | null;
  due_date: string | null;
  whatsapp_message_sent: number;
  mark_old_todos_as_completed: number;

  constructor(editData?: any) {
    this.activitiable_type = editData?.type;
    this.activitiable_id = editData?.id;
    this.activity_type_id = null;
    this.notes = null;
    this.due_date = null;
    this.whatsapp_message_sent = 0;
    this.mark_old_todos_as_completed = 1;
  }
}
