export class PhoneModel {
  phonable_type: string;
  phonable_id: number;
  country_code: string;
  phone: string | null;
  has_whatsapp: 1 | 0;

  constructor(editData?: any) {
    this.phonable_type = editData?.phonable_type;
    this.phonable_id = editData?.phonable_id;
    this.country_code = "EG";
    this.phone = null;
    this.has_whatsapp = 1;
  }
}

export interface Phone {
  id: number;
  country_code: string;
  format_E164?: string;
  format_international: string;
  phone: string;
  format_RFC3966: string;
  has_whatsapp: 1 | 0;
}
