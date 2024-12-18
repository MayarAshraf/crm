import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { LocationModel } from "@modules/Locations/services/service-types";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
} from "@shared";

@Component({
  selector: "app-location-cu",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationCuComponent extends BaseCreateUpdateComponent<LocationModel> {
  #fieldBuilder = inject(FieldBuilderService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      dialogTitle: this.translate.instant(_("create_location")),
      submitButtonLabel: this.translate.instant(_("create")),
      endpoints: {
        store: "locations/store",
        update: "locations/update",
      },
    };

    if (this.editData && !(this.editData.method === "create")) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_location")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = {
        ...new LocationModel(this.editData),
        id: this.editData.id,
      };
    } else if (this.editData && this.editData.method === "create") {
      this.model = {
        ...new LocationModel(),
        no_redirect: 1,
        parent_id: this.editData.id,
      };
    } else {
      this.model = {
        ...new LocationModel(),
        no_redirect: 1,
      };
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "name",
          type: "input-field",
          expressions: {
            "props.placeholder": this.translate.stream(_("name")),
            "props.label": this.translate.stream(_("name")),
          },
          props: {
            required: true,
          },
        },
        {
          key: "slug",
          type: "input-field",
          expressions: {
            "props.placeholder": this.translate.stream(_("slug")),
            "props.label": this.translate.stream(_("slug")),
          },
          props: {
            required: true,
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: "order",
          type: "input-field",
          expressions: {
            "props.placeholder": this.translate.stream(_("order")),
            "props.label": this.translate.stream(_("order")),
          },
          props: {
            type: "number",
            required: true,
          },
        },
        {
          key: "code",
          type: "input-field",
          expressions: {
            "props.placeholder": this.translate.stream(_("code")),
            "props.label": this.translate.stream(_("code")),
          },
          props: {
            type: "number",
            required: true,
          },
        },
        {
          key: "is_active",
          type: "switch-field",
          expressions: {
            "props.placeholder": this.translate.stream(_("is_active")),
            "props.label": this.translate.stream(_("is_active")),
          },
        },
      ]),
      {
        key: "transportation_fees",
        type: "input-field",
        expressions: {
          "props.placeholder": this.translate.stream(_("transportation_fees")),
          "props.label": this.translate.stream(_("transportation_fees")),
        },
        props: {
          type: "number",
        },
      },
    ];
  }
}
