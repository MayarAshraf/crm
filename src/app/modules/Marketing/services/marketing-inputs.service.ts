import { inject, Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { CachedListsService, FieldBuilderService } from "@shared";
import { map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MarketingInputsService {
  #cachedLists = inject(CachedListsService);
  #fieldBuilder = inject(FieldBuilderService);

  campaignsSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        placeholder: data?.props?.placeholder,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`marketing:campaigns`) || [])),
      },
    };
  }

  leadCampaignStatusesSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        placeholder: data?.props?.placeholder,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        options: this.#cachedLists
          .getLists()
          .pipe(map(o => o.get(`marketing:campaign_statuses`) || [])),
      },
    };
  }

  currenciesSelectField(data: FormlyFieldConfig): FormlyFieldConfig {
    return {
      key: data.key,
      type: "select-field",
      className: data?.className,
      expressions: data.expressions,
      hide: data.hide,
      props: {
        label: data?.props?.label,
        placeholder: data?.props?.placeholder,
        required: data?.props?.required,
        filter: data?.props?.filter !== false,
        multiple: data?.props?.multiple,
        showHeader: data?.props?.showHeader !== false,
        options: this.#cachedLists.getLists().pipe(map(o => o.get("marketing:currencies") || [])),
      },
    };
  }

  setCampaignDetailsFieldsGroup(data?: FormlyFieldConfig): FormlyFieldConfig[] {
    return [
      {
        key: "ui_toggler_marketing_details",
        type: "boolean-field",
        hide: data?.hide ?? false,
        props: {
          label: _("marketing_details"),
        },
      },
      this.#fieldBuilder.fieldBuilder([
        this.campaignsSelectField({
          key: "campaign_id",
          expressions: {
            hide: "!model.ui_toggler_marketing_details",
          },
          props: {
            label: _("campaign"),
            placeholder: _("select_campaign"),
          },
        }),
        this.leadCampaignStatusesSelectField({
          key: "lead_campaign_status_id",
          expressions: {
            hide: "!model.ui_toggler_marketing_details",
          },
          props: {
            label: _("lead_campaign_status"),
            placeholder: _("select_lead_campaign_status"),
          },
        }),
      ]),
    ];
  }
}
