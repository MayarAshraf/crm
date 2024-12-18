import { User } from "@modules/Users/services/service-types";

export interface Tag {
  id: number;
  tag?: string;
  creator: User;
  created_at: Date;
  created_since: string;
}

export class TagModel {
  id?: number;
  tag: string | null;
  constructor(editData?: TagModel) {
    this.tag = editData?.tag || null;
  }
}