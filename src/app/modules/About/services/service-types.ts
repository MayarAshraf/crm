export interface About{
  id: number;
  title: string;
  created_at: string;
  last_updated_at: string;
}

export class AboutModel {
  id?: number | null;
  about_section_type_id: number | null;
  translations: [
    {
      language_id: number;
      name: string | null;
      description: string | null;
    },
  ];
  constructor(editData?: AboutModel) {
    this.id = editData?.id;
    this.about_section_type_id = editData?.about_section_type_id || null;
    this.translations = editData?.translations
      ? editData?.translations
      : [
          {
            language_id: 1,
            name: null,
            description: null,
          },
        ];
  }
}