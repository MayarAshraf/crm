export class LocationModel {
  id?: number | null;
  name: string | null;
  slug: string | null;
  order: number;
  code: number | null;
  is_active: 0 | 1;
  transportation_fees: number | null;
  no_redirect?: number | null;
  parent_id?: number | null;

  constructor(editData?: LocationModel) {
    this.name = editData?.name || null;
    this.slug = editData?.slug || null;
    this.order = editData?.order || 0;
    this.code = editData?.code || null;
    this.is_active = editData?.is_active ?? 1;
    this.transportation_fees = editData?.transportation_fees || null;
  }
}