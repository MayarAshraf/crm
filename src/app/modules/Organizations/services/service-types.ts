import { Phone } from "@modules/Phones/services/service-types";
import { SocialAccount } from "@modules/SocialAccounts/services/service-types";
import { MediaFile } from "@shared";

export const ITEM_ORGANIZATION = "Modules\\Organizations\\Organization";

export interface Organization {
  id: number;
  parent_id: number;
  organization: string;
  customers_info: { label: string; value: number };
  ref_no: number;
  description: string;
  logo: string;
  created_at: string;
  created_by: number;
  phones: Phone[];
  social_accounts: SocialAccount[];
  parent: Organization | null;
  assignees_ids: number[];
  parent_info: { label: string; value: number };
}

export class OrganizationModel {
  id?: number;
  parent_id: number | null;
  parent_info: { label: string; value: number } | null;
  organization: string | null;
  description: string | null;
  ref_no: string | null;
  phones: Phone[];
  social_accounts: SocialAccount[];
  customers_ids: number[] | null;
  logo: File | null;
  assignment_rule: string | null;
  users: number[] | null;
  groups: number[] | null;
  assignees_ids?: number[];
  media: MediaFile[] | null;

  constructor(editData?: OrganizationModel) {
    this.parent_id = editData?.parent_id || null;
    this.parent_info = editData?.parent_info || null;
    this.organization = editData?.organization || null;
    this.description = editData?.description || null;
    this.ref_no = editData?.ref_no || null;
    this.phones = this.#mapPhones(editData?.phones) as Phone[];
    this.social_accounts = this.#mapSocialAccounts(editData?.social_accounts) as SocialAccount[];
    this.customers_ids = editData?.customers_ids || null;
    this.assignment_rule = null;
    this.users = editData?.assignees_ids || null;
    this.groups = null;
    this.logo = editData?.logo || null;
    this.media = editData?.media || null;
  }

  #mapPhones(phones: Phone[] | undefined) {
    if (phones && phones.length) {
      return phones.map(phone => ({
        phone: phone.phone,
        country_code: phone.country_code,
        has_whatsapp: phone.has_whatsapp,
      }));
    } else {
      return [{ country_code: "EG", phone: null, has_whatsapp: 1 }];
    }
  }

  #mapSocialAccounts(accounts: SocialAccount[] | undefined) {
    if (accounts && accounts.length) {
      return accounts.map(account => ({
        account_type_id: account.account_type_id,
        social_account: account.social_account,
      }));
    } else {
      return [{ account_type_id: null, social_account: null }];
    }
  }
}
