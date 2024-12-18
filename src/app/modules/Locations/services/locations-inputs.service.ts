import { inject, Injectable, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { CachedListsService, constants, FieldBuilderService } from "@shared";
import { map, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LocationsInputsService {
  // This service uses cascade select
  #cachedLists = inject(CachedListsService);
  #fieldBuilder = inject(FieldBuilderService);

  defaultCountryId = signal(constants.DEFAULT_COUNTRY_ID);
  countryKey = signal("country_id");
  regionKey = signal("region_id");
  cityKey = signal("city_id");
  areaKey = signal("area_place_id");

  getLocationFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.getCountryField(),
        this.getRegionField(),
        this.getCityField(),
        this.getAreaField(),
      ]),
    ];
  }

  #getLocationsOptions(
    field: FormlyFieldConfig | undefined,
    locationName: string,
    locationId: number | null,
  ) {
    field?.props &&
      (field.props.options = this.#cachedLists
        .getLists()
        .pipe(map(o => o.get(`locations:${locationName}:ids:${locationId}`) || [])));
  }

  getCountryField(data?: any): FormlyFieldConfig {
    return {
      key: this.countryKey(),
      type: "select-field",
      className: data?.className,
      resetOnHide: false,
      expressions: {
        hide: data?.hide ?? false,
        "props.required": data?.required ?? false,
        "props.disabled": data?.disabled ?? false,
      },
      props: {
        label: _("country"),
        placeholder: _("select_country"),
        filter: true,
        options: [],
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
      hooks: {
        onInit: field => {
          const regionField = field.parent?.get?.(this.regionKey());
          this.#getLocationsOptions(field, "countries", null);
          this.#getLocationsOptions(regionField, "regions", field.formControl?.value);

          return field.formControl?.valueChanges.pipe(
            tap(id => {
              if (id) {
                this.#cachedLists.updateLists([`locations:regions:ids:${id}`]);
                this.#getLocationsOptions(regionField, "regions", id);
              }
              regionField?.formControl?.setValue(null);
            }),
          );
        },
      },
    };
  }

  getRegionField(data?: any): FormlyFieldConfig {
    return {
      key: this.regionKey(),
      type: "select-field",
      className: data?.className,
      resetOnHide: false,
      expressions: {
        hide: data?.hide ?? (field => !field.model?.[this.countryKey()]),
        "props.required": data?.required ?? false,
        "props.disabled": data?.disabled ?? false,
      },
      props: {
        label: _("region"),
        placeholder: _("select_region"),
        filter: true,
        options: [],
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
      hooks: {
        onInit: field => {
          const cityField = field.parent?.get?.(this.cityKey());
          this.#getLocationsOptions(cityField, "cities", field.formControl?.value);

          return field.formControl?.valueChanges.pipe(
            tap(id => {
              if (id) {
                this.#cachedLists.updateLists([`locations:cities:ids:${id}`]);
                this.#getLocationsOptions(cityField, "cities", id);
              }
              cityField?.formControl?.setValue(null);
            }),
          );
        },
      },
    };
  }

  getCityField(data?: any): FormlyFieldConfig {
    return {
      key: this.cityKey(),
      type: "select-field",
      className: data?.className,
      resetOnHide: false,
      expressions: {
        hide: data?.hide ?? (field => !field.model?.[this.regionKey()]),
        "props.required": data?.required ?? false,
        "props.disabled": data?.disabled ?? false,
      },
      props: {
        label: _("city"),
        placeholder: _("select_city"),
        filter: true,
        options: [],
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
      hooks: {
        onInit: field => {
          const areaField = field.parent?.get?.(this.areaKey());
          this.#getLocationsOptions(areaField, "areas", field.formControl?.value);

          return field.formControl?.valueChanges.pipe(
            tap(id => {
              if (id) {
                this.#cachedLists.updateLists([`locations:areas:ids:${id}`]);
                this.#getLocationsOptions(areaField, "areas", id);
              }
              areaField?.formControl?.setValue(null);
            }),
          );
        },
      },
    };
  }

  getAreaField(data?: any): FormlyFieldConfig {
    return {
      key: this.areaKey(),
      type: "select-field",
      className: data?.className,
      resetOnHide: false,
      expressions: {
        hide: data?.hide ?? (field => !field.model?.[this.cityKey()]),
        "props.required": data?.required ?? false,
        "props.disabled": data?.disabled ?? false,
      },
      props: {
        label: _("area_place"),
        filter: true,
        options: [],
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
    };
  }
}
