import { User } from "@modules/Users/services/service-types";

export interface Group {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string;
  is_hidden: number;
  created_at: string;
  updated_at: string;
  creator: User;
  last_updated_at: string;
  parent_group: Group;
  checked: boolean;
};

export interface Permission {
  id: number;
  name: string;
  is_hidden: number;
  checked: boolean;
  children: Permission[];
};

export interface GroupScope {
  id: number;
  name: string;
  groups: Group[];
};

export class GroupModel {
  id?: number;
  name: string | null;
  parent_id: number | null;

  constructor(editData?: GroupModel) {
    this.name = editData?.name || null;
    this.parent_id = editData?.parent_id || null;
  }
}