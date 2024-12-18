import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  BaseCreateUpdateComponent,
  CachedListsService,
  DynamicDialogComponent,
  FieldBuilderService,
  FormComponent,
  OpenViewDialogService,
} from "@shared";
import { ResourcesListsInputsService } from "../services/resources-lists-inputs.service";
import { Resource, ResourceModel } from "../services/service-type";
import { ResourceViewComponent } from "./index/resource-view/resource-view.component";

@Component({
  selector: "app-resource-cu",
  standalone: true,
  imports: [FormComponent, DynamicDialogComponent],
  templateUrl: "/src/app/shared/components/base-create-update/base-create-update.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceCuComponent extends BaseCreateUpdateComponent<ResourceModel> {
  #cachedLists = inject(CachedListsService);
  #resourcesFields = inject(ResourcesListsInputsService);
  #fieldBuilder = inject(FieldBuilderService);
  #openViewDialog = inject(OpenViewDialogService);

  isSingleUploading = signal(false);
  isMultiUploading = signal(false);

  ngOnInit(): void {
    this.isDisabled = computed(() => this.isSingleUploading() || this.isMultiUploading());

    this.#cachedLists.updateLists(["resources:resource_types"]);
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: "resources/resources/store",
        update: "resources/resources/update",
      },
    };
    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("update_resource")),
        submitButtonLabel: this.translate.instant(_("update_resource")),
      };
      this.model = { id: this.editData.id, ...new ResourceModel(this.editData) };
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_("create_resource")),
        submitButtonLabel: this.translate.instant(_("create_resource")),
      };
      this.model = new ResourceModel();
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: "title",
          type: "input-field",
          props: {
            label: _("title"),
            required: true,
          },
        },
        {
          key: "external_link",
          type: "input-field",
          props: {
            label: _("external_link"),
          },
        },
      ]),
      {
        key: "description",
        type: "textarea-field",
        props: {
          label: _("description"),
          rows: 4,
        },
      },
      this.#fieldBuilder.fieldBuilder(
        [
          this.#resourcesFields.ResourcesSelectField({
            key: "resource_type_id",
            props: {
              label: _("resource_type"),
            },
          }),
          {
            key: "is_active",
            type: "switch-field",
            props: {
              label: _("is_active"),
              trueValue: "on",
              falseValue: "off",
            },
          },
          {
            key: "is_private",
            type: "switch-field",
            props: {
              label: _("is_private"),
              trueValue: "on",
              falseValue: "off",
            },
          },
        ],
        "grid forgrid align-items-center",
      ),
      {
        key: "featured_image",
        type: "file-field",
        props: {
          label: _("featured_image"),
          mode: this.editData ? "update" : "store",
          isUploading: this.isSingleUploading,
        },
      },
      {
        key: "files_names",
        type: "multi-files-field",
        props: {
          label: _("attachments"),
          mode: this.editData ? "update" : "store",
          isUploading: this.isMultiUploading,
        },
      },
    ];
  }

  protected override updateUi(data: Resource) {
    this.#openViewDialog.openViewRecordDialog({ data, component: ResourceViewComponent });
  }
}
