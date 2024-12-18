import { constants } from "@shared";

export class AddressModel {
  id?: number | null;
  addressable_type: string;
  addressable_id: number;
  address_line_1: string | null;
  address_line_2: string | null;
  address_name: string | null;
  phone_number: string | null;
  postal_code: string | null;
  long: string | null;
  lat: string | null;
  building_number: string | null;
  floor_number: string | null;
  landmark: string | null;
  country_id: number;
  region_id: number | null;
  city_id: number | null;
  area_id: number | null;

  constructor(editData: AddressModel) {
    this.addressable_type = editData.addressable_type;
    this.addressable_id = editData.addressable_id;
    this.address_line_1 = editData?.address_line_1 || null;
    this.address_line_2 = editData?.address_line_2 || null;
    this.address_name = editData?.address_name || null;
    this.phone_number = editData?.phone_number || null;
    this.postal_code = editData?.postal_code || null;
    this.long = editData?.long || null;
    this.lat = editData?.lat || null;
    this.building_number = editData?.building_number || null;
    this.floor_number = editData?.floor_number || null;
    this.landmark = editData?.landmark || null;
    this.country_id = editData?.country_id || constants.DEFAULT_COUNTRY_ID;
    this.region_id = editData?.region_id || null;
    this.city_id = editData?.city_id || null;
    this.area_id = editData?.area_id || null;
  }
}
