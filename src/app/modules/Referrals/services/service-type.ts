export interface Referral {
  id: number;
  referral: string;
  description: string;
  created_at: string;
  created_by: number;
}

export class ReferralModel {
  id?: number;
  referral: string | null;
  description: string | null;

  constructor(editData?: ReferralModel) {
    this.referral = editData?.referral || null;
    this.description = editData?.description || null;
  }
}
