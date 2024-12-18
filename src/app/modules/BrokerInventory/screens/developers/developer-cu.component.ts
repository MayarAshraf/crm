import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FormComponent,
} from "@shared";
import { DeveloperModel } from "../../services/service-types";

@Component({
  selector: "app-developer-cu",
  standalone: true,
  imports: [FormComponent, DynamicDialogComponent],
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperCuComponent extends BaseCreateUpdateComponent<DeveloperModel> {
  #cachedLists = inject(CachedListsService);

  ngOnInit(): void {
    this.#cachedLists.updateLists(["assignments:users"]);

    this.dialogMeta = {
      ...this.dialogMeta,
      createApiVersion: "v2",
      updateApiVersion: "v2",
      endpoints: {
        store: "broker-inventory/developers/store",
        update: "broker-inventory/developers/update",
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_developer")),
        submitButtonLabel: this.translate.instant(_("update")),
      };
      this.model = { id: this.editData.id, ...new DeveloperModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_developer")),
        submitButtonLabel: this.translate.instant(_("create")),
      };
      this.model = new DeveloperModel();
    }

    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: "developer",
        type: "input-field",
        props: {
          required: true,
          label: _("name"),
        },
      },
    ];
  }
}
