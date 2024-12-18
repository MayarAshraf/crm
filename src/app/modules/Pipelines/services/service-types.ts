export interface Pipeline {
  id: number;
  name: string;
  pipelinable: string;
  created_at: string;
}

export interface PipelineStage {
  id: number;
  probability: number;
  name: string;
  created_at: string
}

export class PipelineModel {
  id?: number;
  pipelinable_id?: number;
  translations: {
    language_id: number;
    name: string | null;
    description: string | null;
  }[];
  constructor(editData?: PipelineModel) {
    this.translations = editData?.translations || [
      {
        language_id: 1,
        name: null,
        description: null,
      },
    ];
  }
}

export class PipelineStageModel {
  id?: number;
  pipeline_id?: number;
  order: number;
  probability: number | null;
  translations: {
    language_id: number;
    name: string | null;
    description: string | null;
  }[];
  constructor(editData?: PipelineStageModel) {
    this.order = editData?.order || 0;
    this.probability = editData?.probability || null;
    this.translations = editData?.translations || [
      {
        language_id: 1,
        name: null,
        description: null,
      },
    ];
  }
}