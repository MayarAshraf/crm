import { ChangeDetectionStrategy, Component } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { BaseCreateUpdateComponent, DynamicDialogComponent, FormComponent } from "@shared";

@Component({
  selector: "app-check-ins-details",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  imports: [FormComponent, DynamicDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckInsDetailsComponent extends BaseCreateUpdateComponent<any> {
  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      showResetButton: false,
      showSubmitButton: false,
    };

    this.dialogMeta = {
      ...this.dialogMeta,
      dialogTitle: this.translate.instant(_("view_check_in")),
    };
    this.model = {
      geo_location: {
        lat: this.editData.latitude,
        lng: this.editData.longitude,
      },
    };

    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        type: "map-field",
        props: {
          isReadOnlyMap: true,
          isHiddenButton: true,
        },
      },
    ];
  }
}
