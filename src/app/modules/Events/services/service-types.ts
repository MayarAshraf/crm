import { constants } from "@shared";

export const ITEM_CLASS_EVENT = "Modules\\Events\\Event";

export interface IEvent {
  id: number;
  subject: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status_id: number;
  country_id: number;
  region_id: number | null;
  city_id: number | null;
  area_place_id: number | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  eventable_type: string;
  eventable_id: number;
  broker_id: number | null;
  developer_id: number | null;
  attendees_ids: number[] | null;
  interests_ids: number[] | null;
  tags_ids: number[] | null;
  type_id: number;
  bi_unit_id: number | null;
  start_date_datetime_picker: string;
  end_date_datetime_picker: string | null;
  created_at: string;
  created_by: number;
}

export class EventModel {
  id?: number;
  ui_toggler_end_date?: boolean;
  eventable_type: string;
  eventable_id: number;
  type_id: number;
  start_date: string | null;
  end_date: string | null;
  attendees: number[] | null;
  interests: number[] | null;
  tags: number[] | null;
  description: string | null;
  country_id: number;
  region_id: number | null;
  city_id: number | null;
  area_place_id: number | null;
  subject: string | null;
  status_id: number;
  bi_unit_id: number | null;
  address: string | null;
  lat: string | null;
  lng: string | null;

  constructor(editData?: any) {
    this.id = editData?.id;
    this.ui_toggler_end_date = editData?.end_date || false;
    this.eventable_type = editData?.eventable_type;
    this.eventable_id = editData?.eventable_id;
    this.type_id = editData?.type_id || 2;
    this.start_date = editData?.start_date || null;
    this.end_date = editData?.end_date || null;
    this.attendees = editData?.attendees_ids || null;
    this.interests = editData?.interests_ids || null;
    this.tags = editData?.tags_ids || null;
    this.description = editData?.description || null;
    this.country_id = editData?.country_id || constants.DEFAULT_COUNTRY_ID;
    this.region_id = editData?.region_id || null;
    this.city_id = editData?.city_id || null;
    this.area_place_id = editData?.area_place_id || null;
    this.subject = editData?.subject || "New Event";
    this.status_id = editData?.status_id || 1;
    this.bi_unit_id = editData?.bi_unit_id || null;
    this.address = editData?.address || null;
    this.lat = editData?.lat || null; // 29.976631
    this.lng = editData?.lng || null; // 31.285002
  }
}
