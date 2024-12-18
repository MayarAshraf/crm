import { MediaFile } from "@shared";

export class typeModel {
  id?: number;
  order: number;
  title: string | null;
  constructor(editData?: typeModel) {
    this.order = editData?.order || 0;
    this.title = editData?.title || null;
  }
}

export interface Resource {
  created_at: string;
  created_by: number;
  deleted_at: string | null;
  deleted_by: number | null;
  description: string;
  external_link: string | null;
  featured_image: string | null;
  id: number;
  is_active: boolean;
  is_private: boolean;
  media: MediaFile[];
  resource_type_id: string;
  title: string;
  updated_at: string;
  updated_by: number;
}

export class ResourceModel {
  id?: number;
  title: string | null;
  description: string | null;
  is_active: "on" | "off";
  is_private: "on" | "off";
  resource_type_id: string | null;
  featured_image: File | null;
  media: MediaFile[] | null;

  constructor(editData?: ResourceModel) {
    this.title = editData?.title || null;
    this.description = editData?.description || null;
    this.is_active = editData?.is_active ?? "on" ? "on" : "off";
    this.is_private = editData?.is_private ? "on" : "off";
    this.resource_type_id = editData?.resource_type_id || null;
    this.featured_image = editData?.featured_image || null;
    this.media = editData?.media || null;
  }
}
