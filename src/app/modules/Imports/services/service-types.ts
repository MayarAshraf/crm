export class AssignmentRuleModel {
  id?: number;
  name: string | null;
  assignment_rule_type_id: number | null;
  users: number | null;
  forcing_keep_me_there: 1 | 0;
  auto_hand_over: 1 | 0;
  duration: number;
  duration_unit: string | "hours";

  constructor(editData?: AssignmentRuleModel) {
    this.name = editData?.name || null;
    this.assignment_rule_type_id = editData?.assignment_rule_type_id || null;
    this.users = editData?.users || null;
    this.forcing_keep_me_there = editData?.forcing_keep_me_there || 0;
    this.auto_hand_over = editData?.auto_hand_over || 0;
    this.duration = editData?.duration ?? 1;
    this.duration_unit = editData?.duration_unit || "hours";
  }
}

export class ImportLeadsModel {
  import_id?: number;
  file_type: string;
  file: File | null;
  source_id: number | null;
  status_id: number | null;
  country_codes: string[] | null;
  is_cold_calls: "on" | "off";
  interests: number[] | null;
  tags: number[] | null;
  organization_id: number | null;
  campaign_id: number | null;
  lead_campaign_status_id: number | null;
  lead_type_id: number;
  lead_list_id: number | null;
  lead_classification_id: number | null;
  lead_quality_id: number | null;

  constructor() {
    this.file_type = "8x";
    this.file = null;
    this.source_id = null;
    this.status_id = null;
    this.country_codes = ["EG"];
    this.is_cold_calls = "off";
    this.interests = null;
    this.tags = null;
    this.organization_id = null;
    this.campaign_id = null;
    this.lead_campaign_status_id = null;
    this.lead_type_id = 1;
    this.lead_list_id = null;
    this.lead_classification_id = null;
    this.lead_quality_id = null;
  }
}
