import { inject, Injectable } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { ITEM_BI_UNIT } from "@modules/BrokerInventory/services/service-types";
import { InterestsInputsService } from "@modules/Interests/services/interests-inputs.service";
import { LocationsInputsService } from "@modules/Locations/services/locations-inputs.service";
import { TagsInputsService } from "@modules/Tags/services/tags-lists-inputs.service";
import { UsersInputsService } from "@modules/Users/services/users-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { CachedListsService, constants, FieldBuilderService } from "@shared";
import { map, tap } from "rxjs";
import { EventInpusService } from "./event-inputs.service";

@Injectable({
  providedIn: "root",
})
export class EventFieldsService {
  #interestsInputs = inject(InterestsInputsService);
  #tagsInputs = inject(TagsInputsService);
  #locationsInputs = inject(LocationsInputsService);
  #usersInputs = inject(UsersInputsService);
  #fieldBuilder = inject(FieldBuilderService);
  #cachedLists = inject(CachedListsService);
  #eventInpus = inject(EventInpusService);

  getTypeField(): FormlyFieldConfig {
    return {
      key: "type_id",
      type: "select-field",
      className: "col-12 md:col-4",
      props: {
        required: true,
        label: _("type"),
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`events:event_types`) || [])),
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
    };
  }

  getStartDateUiField(className?: string): FormlyFieldConfig {
    return {
      key: "start_date",
      type: "date-field",
      className,
      props: {
        required: true,
        label: _("start_date"),
        showTime: true,
      },
    };
  }

  getEndDateUiField(forceShow = false, className?: string): FormlyFieldConfig {
    return {
      key: "end_date",
      type: "date-field",
      resetOnHide: false,
      className,
      expressions: {
        hide: ({ model }) => (forceShow ? false : !model.ui_toggler_end_date),
      },
      props: {
        label: _("end_date"),
        showTime: true,
      },
    };
  }

  getAttendeesField(): FormlyFieldConfig {
    return this.#usersInputs.usersSelectField({
      key: "attendees",
      props: {
        label: _("attendees"),
        multiple: true,
      },
    });
  }

  getStatusIdField(): FormlyFieldConfig {
    return {
      key: "status_id",
      type: "select-field",
      expressions: {
        hide: ({ model }) => !model.ui_toggler_advanced,
      },
      props: {
        placeholder: _("status"),
        label: _("status"),
        required: true,
        filter: true,
        options: this.#cachedLists.getLists().pipe(map(o => o.get(`events:event_statuses`) || [])),
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
    };
  }

  getInterestsField(className?: string): FormlyFieldConfig {
    return this.#interestsInputs.interestsSelectField({
      key: "interests",
      className,
      props: {
        label: _("interests"),
        placeholder: _("interests"),
        multiple: true,
      },
    });
  }

  getTagsField(className?: string): FormlyFieldConfig {
    return this.#tagsInputs.tagsSelectField({
      key: "tags",
      className,
      props: {
        label: _("tags"),
        placeholder: _("tags"),
        multiple: true,
      },
    });
  }

  getMapField(isReadOnlyMap = false): FormlyFieldConfig[] {
    return [
      {
        type: "map-field",
        props: {
          isReadOnlyMap,
          lat: "lat",
          long: "lng",
        },
        expressions: {
          hide: ({ model }) => !model.ui_toggler_advanced,
        },
        hooks: {
          onInit: field => {
            const latField = field.form?.get(field.props?.lat);
            const lngField = field.form?.get(field.props?.long);

            return field.formControl?.valueChanges.pipe(
              tap(latLng => {
                latField?.setValue(latLng.lat());
                lngField?.setValue(latLng.lng());
              }),
            );
          },
        },
      },
      {
        key: "lat",
        hooks: {
          onInit: field => {
            if (!field.model?.geo_location?.lat) return;
            field.formControl?.setValue(field.model.geo_location.lat);
          },
        },
      },
      {
        key: "lng",
        hooks: {
          onInit: field => {
            if (!field.model?.geo_location?.lng) return;
            field.formControl?.setValue(field.model.geo_location.lng);
          },
        },
      },
    ];
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "eventable_type",
      },
      {
        key: "eventable_id",
      },
      this.#fieldBuilder.fieldBuilder([
        this.getTypeField(),
        this.getStartDateUiField("col-12 md:col-4"),
        {
          key: "ui_toggler_end_date",
          type: "boolean-field",
          expressions: {
            hide: "model.ui_toggler_end_date",
          },
          props: {
            label: _("set_end_date"),
          },
        },
        this.getEndDateUiField(false, "col-12 md:col-4"),
      ]),
      this.getAttendeesField(),
      this.#eventInpus.getDescField(),
      this.#fieldBuilder.fieldBuilder([
        this.getInterestsField("col-12 md:col-6"),
        this.getTagsField("col-12 md:col-6"),
      ]),
      {
        key: "ui_toggler_advanced",
        type: "boolean-field",
        props: {
          label: _("advanced"),
        },
      },
      this.#fieldBuilder.fieldBuilder([
        this.#locationsInputs.getCountryField({
          hide: (field: FormlyFieldConfig) => !field.model.ui_toggler_advanced,
        }),
        this.#locationsInputs.getRegionField({
          hide: (field: FormlyFieldConfig) => !field.model.ui_toggler_advanced,
        }),
        this.#locationsInputs.getCityField({
          hide: (field: FormlyFieldConfig) => !field.model.ui_toggler_advanced,
          disabled: (field: FormlyFieldConfig) => !field.model.region_id,
        }),
        this.#locationsInputs.getAreaField({
          hide: (field: FormlyFieldConfig) => !field.model.ui_toggler_advanced,
          disabled: (field: FormlyFieldConfig) => !field.model.city_id,
        }),
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "subject",
          type: "input-field",
          expressions: {
            hide: ({ model }) => !model.ui_toggler_advanced,
          },
          props: {
            label: _("subject"),
            required: true,
            maxLength: constants.MAX_LENGTH_TEXT_INPUT,
          },
        },
        this.getStatusIdField(),
        {
          key: "bi_unit_info",
          type: "autocomplete-field",
          expressions: {
            hide: ({ model }) => !model.ui_toggler_advanced,
          },
          props: {
            label: _("unit"),
            placeholder: _("unit_code_number_title"),
            entity: ITEM_BI_UNIT,
            fieldKey: "bi_unit_id",
          },
        },
        {
          key: "bi_unit_id",
        },
      ]),
      {
        key: "address",
        type: "input-field",
        expressions: {
          hide: ({ model }) => !model.ui_toggler_advanced,
        },
        props: {
          label: _("address"),
          placeholder: _("address"),
          maxLength: constants.MAX_LENGTH_TEXT_INPUT,
        },
      },
      ...this.getMapField(),
    ];
  }
}
