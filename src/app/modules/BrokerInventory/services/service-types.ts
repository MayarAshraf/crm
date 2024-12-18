import { constants } from "@shared";

export const ITEM_BI_UNIT = "Modules\\BrokerInventory\\BIUnit";
export const ITEM_BI_DEVELOPER = "Modules\\BrokerInventory\\BIDeveloper";

export interface UnitMatchingRequestModel {
  [key: string]: number;
}

export interface UnitMatchingRequestFields {
  key: string;
  value: number;
}

export enum TypeUnitConfig {
  FULLCREATION = "is_full_creation_hidden",
  ISREQUIRED = "is_required",
}

export interface UpdateUnitConfigModel {
  id: number;
  update_type: string;
  update_value: boolean | number;
}

export interface UpdateUnitRequestConfigModel {
  id: number;
  update_type: string;
  update_value: boolean | number;
}

export interface UnitConfig {
  id: number;
  field: string;
  is_full_creation_hidden: boolean;
  is_required: boolean;
}

export interface UnitRequestConfig {
  id: number;
  field: string;
  is_full_creation_hidden: boolean;
  is_required: boolean;
}

export class FacilityModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    facility: string | null;
  }[];

  constructor(editData?: FacilityModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        facility: null,
      },
    ];
  }
}

export class AmenityModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    amenity: string | null;
  }[];

  constructor(editData?: AmenityModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        amenity: null,
      },
    ];
  }
}

export class AreaUnitModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    area_unit: string | null;
  }[];

  constructor(editData?: AreaUnitModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        area_unit: null,
      },
    ];
  }
}

export class BathroomModel {
  id?: number;
  order: number | null;
  count: number | null;
  translations: {
    language_id: number | null;
    displayed_text: string | null;
  }[];

  constructor(editData?: BathroomModel) {
    this.order = editData?.order || 0;
    this.count = editData?.count || null;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        displayed_text: null,
      },
    ];
  }
}

export class BedroomModel {
  id?: number;
  order: number | null;
  count: number | null;
  translations: {
    language_id: number | null;
    displayed_text: string | null;
  }[];

  constructor(editData?: BedroomModel) {
    this.order = editData?.order || 0;
    this.count = editData?.count || null;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        displayed_text: null,
      },
    ];
  }
}

export class FinishingTypeModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    finishing_type: string | null;
  }[];

  constructor(editData?: FinishingTypeModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        finishing_type: null,
      },
    ];
  }
}

export class PurposeTypeModel {
  id?: number;
  order: number | null;
  bi_purpose_id: number | null;
  translations: {
    language_id: number | null;
    purpose_type: string | null;
  }[];

  constructor(editData?: PurposeTypeModel) {
    this.order = editData?.order || 0;
    this.bi_purpose_id = editData?.bi_purpose_id || null;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        purpose_type: null,
      },
    ];
  }
}

export class PurposeModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    purpose: string | null;
  }[];

  constructor(editData?: PurposeModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        purpose: null,
      },
    ];
  }
}

export class FurnishingStatusModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    furnishing_status: string | null;
  }[];

  constructor(editData?: FurnishingStatusModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        furnishing_status: null,
      },
    ];
  }
}

export class OfferingTypeModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    offering_type: string | null;
  }[];

  constructor(editData?: OfferingTypeModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        offering_type: null,
      },
    ];
  }
}

export class PaymentMethodModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    payment_method: string | null;
  }[];

  constructor(editData?: PaymentMethodModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        payment_method: null,
      },
    ];
  }
}

export class PositionModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    position: string | null;
  }[];

  constructor(editData?: PositionModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        position: null,
      },
    ];
  }
}

export class ViewModel {
  id?: number;
  order: number | null;
  translations: {
    language_id: number | null;
    view: string | null;
  }[];

  constructor(editData?: ViewModel) {
    this.order = editData?.order || 0;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        view: null,
      },
    ];
  }
}

export class FloorNumberModel {
  id?: number;
  order: number | null;
  count: number | null;
  translations: {
    language_id: number | null;
    displayed_text: string | null;
  }[];

  constructor(editData?: FloorNumberModel) {
    this.order = editData?.order || 0;
    this.count = editData?.count || null;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        displayed_text: null,
      },
    ];
  }
}

export class DeveloperModel {
  id?: number;
  developer: string | null;

  constructor(editData?: DeveloperModel) {
    this.developer = editData?.developer || null;
  }
}
export interface Project {
  id: number;
  developer_id: number;
  developer_info: { label: string; value: number } | null;
  slug: string;
  delivery_date: string | null;
  finished_status: number;
  country_id: number;
  region_id: number | null;
  city_id: number | null;
  area_place_id: number | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  bi_area_unit_id: number | null;
  area_from: number | null;
  area_to: number | null;
  price_from: number | null;
  price_to: number | null;
  currency_code: string | null;
  down_payment_from: number | null;
  down_payment_to: number | null;
  number_of_installments_from: number | null;
  number_of_installments_to: number | null;
  is_featured: boolean;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
  deleted_at: string | null;
  deleted_by: number | null;
  value: string;
  description: string;
  meta_title: string;
  meta_description: string;
}

export class ProjectModel {
  id?: number;
  developer_info: { label: string; value: number } | null;
  developer_id: number | null;
  translations: {
    language_id: number;
    project: string | null;
    description: string | null;
    meta_title: string | null;
    meta_description: string | null;
  }[];
  is_featured: boolean | null;
  country_id: number;
  region_id: number | null;
  city_id: number | null;
  area_place_id: number | null;
  latitude: string | null;
  longitude: string | null;
  address: string | null;
  delivery_date: string | null;
  finished_status: boolean;
  area_from: number | null;
  area_to: number | null;
  bi_area_unit_id: number | null;
  price_from: number | null;
  price_to: number | null;
  down_payment_to: number | null;
  down_payment_from: number | null;
  currency_code: string | null;
  number_of_installments_from: number | null;
  number_of_installments_to: number | null;

  constructor(editData?: ProjectModel) {
    this.id = editData?.id;
    this.developer_info = editData?.developer_info || null;
    this.developer_id = editData?.developer_id || null;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        project: null,
        description: null,
        meta_title: null,
        meta_description: null,
      },
    ];
    this.is_featured = editData?.is_featured ? true : false;
    this.country_id = editData?.country_id || constants.DEFAULT_COUNTRY_ID;
    this.region_id = editData?.region_id || null;
    this.city_id = editData?.city_id || null;
    this.area_place_id = editData?.area_place_id || null;
    this.latitude = editData?.latitude || null;
    this.longitude = editData?.longitude || null;
    this.address = editData?.address || null;
    this.delivery_date = editData?.delivery_date || null;
    this.finished_status = editData?.finished_status ? true : false;
    this.area_from = editData?.area_from || null;
    this.area_to = editData?.area_to || null;
    this.bi_area_unit_id = editData?.bi_area_unit_id || null;
    this.price_from = editData?.price_from || null;
    this.price_to = editData?.price_to || null;
    this.down_payment_to = editData?.down_payment_to || null;
    this.down_payment_from = editData?.down_payment_from || null;
    this.currency_code = editData?.currency_code || "EGP";
    this.number_of_installments_from = editData?.number_of_installments_from || null;
    this.number_of_installments_to = editData?.number_of_installments_to || null;
  }
}
