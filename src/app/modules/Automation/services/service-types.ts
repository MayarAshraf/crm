export interface Rule {
  id: number;
  tag?: string;
};

export class RuleModel {
  id?: number;
  name: string | null;
  is_active: 0 | 1;
  apply_type: "any" | "all";
  conditions: {
    name: string | null;
    operator: string | null;
    value: number | number[] | string | null;
  }[];
  actions: {
    name: string | null;
    value: number | number[] | string | null;
  }[];

  constructor(editData?: RuleModel) {
    this.name = editData?.name ?? null;
    this.apply_type = editData?.apply_type ?? "all";
    this.is_active = editData ? editData.is_active : 1;
    this.conditions = editData?.conditions || [{ name: null, operator: null, value: null }];
    this.actions = editData?.actions || [{ name: null, value: null }];
  }
};

export interface RuleResponse {
  conditions: RuleOption[];
  actions: RuleOption[];
}

export interface RuleOption {
  value: string;
  label: string;
  value_type: string;
  value_options: ValueOption[];
  description: string;
  operators: Operator[];
  multiple: boolean;
}

export interface Operator {
  value: string;
  label: string;
  multiple: boolean;
}

export interface ValueOption {
  value: number;
  label: string;
}