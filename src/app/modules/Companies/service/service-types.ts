export class CompanyModel {
  id?: number;
  company_name: string | null;
  mobile_number: number | null;
  whatsapp_number: number | null;
  hotline: number | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  constructor(editData?: CompanyModel) {
    this.company_name = editData?.company_name || null;
    this.mobile_number = editData?.mobile_number || null;
    this.whatsapp_number = editData?.whatsapp_number || null;
    this.hotline = editData?.hotline || null;
    this.email = editData?.email || null;
    this.website = editData?.website || null;
    this.facebook = editData?.facebook || null;
    this.twitter = editData?.twitter || null;
    this.instagram = editData?.instagram || null;
    this.linkedin = editData?.linkedin || null;
  }
};