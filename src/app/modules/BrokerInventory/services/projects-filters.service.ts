import { inject, Injectable, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateService } from "@ngx-translate/core";
import { CachedListsService, FilterConfig } from "@shared";
import { ITEM_BI_DEVELOPER } from "./service-types";

@Injectable({
  providedIn: "root",
})
export class ProjectsFiltersService {
  #cachedLists = inject(CachedListsService);
  #translate = inject(TranslateService);

  countryId = signal<number | null>(null);
  regionId = signal<number | null>(null);
  cityId = signal<number | null>(null);

  getProjectsFilters(): FilterConfig[] {
    return [
      {
        type: "autocomplete",
        name: "developer_ids",
        label: this.#translate.instant(_("developers")),
        entity: ITEM_BI_DEVELOPER,
        default: null,
        is_multiple: true,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "daterange",
        name: "delivery_range",
        label: this.#translate.instant(_("delivery_date_range")),
        default: null,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "daterange",
        name: "created_at_range",
        label: this.#translate.instant(_("creation_date_range")),
        default: null,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "select",
        name: "country_ids",
        label: this.#translate.instant(_("filter_by_countries")),
        options: this.#cachedLists.loadLists().get("locations:countries:ids:null") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
        onChange: (event, form) => {
          this.countryId.set(event.value);
          form.get("region_ids")?.setValue(null);
        },
      },
      {
        type: "select",
        name: "region_ids",
        label: this.#translate.instant(_("filter_by_regions")),
        options:
          this.#cachedLists.loadLists().get(`locations:regions:ids:${this.countryId()}`) || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: !this.countryId(),
        onChange: (event, form) => {
          this.regionId.set(event.value);
          form.get("city_ids")?.setValue(null);
        },
      },
      {
        type: "select",
        name: "city_ids",
        label: this.#translate.instant(_("filter_by_cities")),
        options: this.#cachedLists.loadLists().get(`locations:cities:ids:${this.regionId()}`) || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: !this.regionId(),
        onChange: (event, form) => {
          this.cityId.set(event.value);
          form.get("area_place_ids")?.setValue(null);
        },
      },
      {
        type: "select",
        name: "area_place_ids",
        label: this.#translate.instant(_("filter_by_area_places")),
        options: this.#cachedLists.loadLists().get(`locations:areas:ids:${this.cityId()}`) || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: !this.cityId(),
      },
      {
        type: "select",
        name: "bi_area_unit_ids",
        label: this.#translate.instant(_("area_unit")),
        options: this.#cachedLists.loadLists().get("broker_inventory:area_units") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
      },
      {
        type: "number",
        name: "price_from",
        label: this.#translate.instant(_("price_from")),
        default: null,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "number",
        name: "price_to",
        label: this.#translate.instant(_("price_to")),
        default: null,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "number",
        name: "area_from",
        label: this.#translate.instant(_("area_from")),
        default: null,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "number",
        name: "area_to",
        label: this.#translate.instant(_("area_to")),
        default: null,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "switcher",
        name: "is_featured",
        label: this.#translate.instant(_("is_featured")),
        default: false,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "switcher",
        name: "is_finished",
        label: this.#translate.instant(_("is_finished")),
        default: false,
        is_required: false,
        is_hidden: false,
      },
      {
        type: "number",
        name: "number_of_installments_from",
        label: this.#translate.instant(_("number_of_installments_from")),
        default: null,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "number",
        name: "number_of_installments_to",
        label: this.#translate.instant(_("number_of_installments_to")),
        default: null,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "number",
        name: "down_payment_from",
        label: this.#translate.instant(_("down_payment_from")),
        default: null,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "number",
        name: "down_payment_to",
        label: this.#translate.instant(_("down_payment_to")),
        default: null,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "select",
        name: "currency_codes",
        label: this.#translate.instant(_("currency_codes")),
        options: this.#cachedLists.loadLists().get("marketing:currencies") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "select",
        name: "creators",
        label: this.#translate.instant(_("creators")),
        options: this.#cachedLists.loadLists().get("assignments:users") || [],
        default: null,
        is_required: false,
        is_multiple: true,
        is_hidden: false,
        is_advanced: true,
      },
      {
        type: "daterange",
        name: "last_updated_at_range",
        label: this.#translate.instant(_("select_last_updated_at_range")),
        default: null,
        is_required: false,
        is_hidden: false,
        is_advanced: true,
      },
    ];
  }
}
