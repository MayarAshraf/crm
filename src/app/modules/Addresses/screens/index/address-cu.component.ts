import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { AddressModel } from "@modules/Addresses/services/service-type";
import { LocationsInputsService } from "@modules/Locations/services/locations-inputs.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
} from "@shared";
import { tap } from "rxjs";

@Component({
  selector: "app-address-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LocationsInputsService],
})
export class AddressCuComponent extends BaseCreateUpdateComponent<AddressModel> {
  #locationsInputs = inject(LocationsInputsService);
  #cachedLists = inject(CachedListsService);
  #fieldBuilder = inject(FieldBuilderService);

  ngOnInit() {
    this.#locationsInputs.areaKey.set("area_id");

    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "addresses/addresses/store",
        update: "addresses/addresses/update",
      },
      createApiVersion: "v2",
      updateApiVersion: "v2",
    };

    if (this.editData.id) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_address")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new AddressModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_address")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new AddressModel(this.editData);
    }
    this.#updateLists();
    this.fields = this.configureFields();
  }

  #updateLists() {
    let lists = ["locations:countries:ids:null"];

    const countryId = this.editData?.country_id;
    const regionId = this.editData?.region_id;
    const cityId = this.editData?.city_id;

    lists.push(`locations:regions:ids:${countryId || this.model.country_id}`);
    regionId && lists.push(`locations:cities:ids:${regionId}`);
    cityId && lists.push(`locations:areas:ids:${cityId}`);
    this.#cachedLists.updateLists(lists);
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "addressable_type",
      },
      {
        key: "addressable_id",
      },
      {
        key: "address_line_1",
        type: "input-field",
        props: {
          required: true,
          label: _("address_line_1"),
        },
        expressions: {
          "props.placeholder": this.translate.stream(_("address_line_1")),
        },
      },
      {
        key: "address_line_2",
        type: "input-field",
        props: {
          label: _("address_line_2"),
        },
        expressions: {
          "props.placeholder": this.translate.stream(_("address_line_2")),
        },
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: "address_name",
          type: "input-field",
          props: {
            label: _("address_name"),
          },
          expressions: {
            "props.placeholder": this.translate.stream(_("address_name")),
          },
        },
        {
          key: "phone_number",
          type: "input-field",
          props: {
            label: _("phone_number"),
          },
          expressions: {
            "props.placeholder": this.translate.stream(_("phone_number")),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "postal_code",
          type: "input-field",
          props: {
            label: _("postal_code"),
          },
          expressions: {
            "props.placeholder": this.translate.stream(_("postal_code")),
          },
        },
        {
          key: "building_number",
          type: "input-field",
          props: {
            label: _("building_number"),
          },
          expressions: {
            "props.placeholder": this.translate.stream(_("building_number")),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "floor_number",
          type: "input-field",
          props: {
            label: _("floor_number"),
          },
          expressions: {
            "props.placeholder": this.translate.stream(_("floor_number")),
          },
        },
        {
          key: "landmark",
          type: "input-field",
          props: {
            label: _("landmark"),
          },
          expressions: {
            "props.placeholder": this.translate.stream(_("landmark")),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        this.#locationsInputs.getCountryField({
          required: () => true,
          className: "col-12 md:col-6",
        }),
        this.#locationsInputs.getRegionField({
          required: () => true,
          className: "col-12 md:col-6",
        }),
        this.#locationsInputs.getCityField(),
        this.#locationsInputs.getAreaField(),
      ]),
      {
        type: "map-field",
        props: {
          isReadOnlyMap: false,
          isHiddenButton: false,
          lat: "lat",
          long: "long",
        },
        hooks: {
          onInit: field => {
            const latField = field.form?.get(field.props?.lat);
            const lngField = field.form?.get(field.props?.long);

            return field.formControl?.valueChanges.pipe(
              tap(latLng => {
                latField?.setValue("" + latLng.lat());
                lngField?.setValue("" + latLng.lng());
              }),
            );
          },
        },
      },
      {
        key: "long",
      },
      {
        key: "lat",
      },
    ];
  }
}
