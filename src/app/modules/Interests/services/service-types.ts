export interface Interest {
  id: number;
  interest?: string;
  created_at: Date;
  created_since: string;
}

export class InterestModel {
  id?: number;
  interest: string | null;
  constructor(editData?: InterestModel) {
    this.interest = editData?.interest || null;
  }
}