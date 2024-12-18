export class DynamicListModel {
  id?: number;
  order: number;
  list_id?: number;
  translations: {
    language_id: number | null;
    value: string | null;
  }[];

  constructor(editData?: DynamicListModel) {
    this.order = editData?.order || 0;
    this.list_id = editData?.list_id;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        value: null,
      },
    ];
  }
}
