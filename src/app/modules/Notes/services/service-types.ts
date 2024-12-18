export const ITEM_CLASS_NOTE = "Modules\\Notes\\Note";

export interface INote {
  id: number;
  subject: string;
  description: string;
  notable_type: string;
  notable_id: number;
  created_at: string;
  created_by: number;
}

export class NoteModel {
  notable_type: string;
  notable_id: number;
  subject: string | null;
  description: string | null;

  constructor(editData?: any) {
    this.notable_type = editData?.type;
    this.notable_id = editData?.id;
    this.description = null;
    this.subject = null;
  }
}
