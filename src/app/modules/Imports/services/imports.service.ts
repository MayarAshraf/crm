import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ImportsService {

  public durationUnits = [
    { value: "minutes", label: "Minutes" },
    { value: "hours", label: "hours" },
    { value: "days", label: "Days" },
  ];

  public fblgiIdentifierTypes = [
    { value: "form_id", label: "Form ID" },
    { value: "page_id", label: "Page ID" },
    { value: "ad_id", label: "Ad ID" },
    { value: "adgroup_id", label: "Ad Group ID" },
  ];
}
