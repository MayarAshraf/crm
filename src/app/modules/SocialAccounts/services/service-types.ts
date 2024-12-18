export class AccountModel {
  accountable_type: string;
  accountable_id: number;
  account_type_id: number | null;
  social_account: string | null;

  constructor(editData?: any) {
    this.accountable_type = editData?.type;
    this.accountable_id = editData?.id;
    this.account_type_id = null;
    this.social_account = null;
  }
}

export interface SocialAccount {
  id: number;
  account_type: AccountType;
  social_account: string;
  account_type_id: number;
  accountable_type: string;
  accountable_id: number;
  created_at: string;
  created_by: number;
}

export interface AccountType {
  id: number;
  order: number;
  is_default: number;
  font_awesome_class: string;
  default_local: DefaultLocal;
}

export interface DefaultLocal {
  account_type_id: number;
  account_type: string;
  created_at: string;
}
