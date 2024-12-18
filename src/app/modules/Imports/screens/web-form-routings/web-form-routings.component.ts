import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, TemplateRef, inject, viewChild } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { WebFormRoutingCuComponent } from "./web-form-routings-cu.component";

@Component({
  selector: "app-index-web-form-routing",
  standalone: true,
  templateUrl: "./web-form-routings.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexWebFormRoutingComponent extends BaseIndexComponent<
  any,
  ComponentType<WebFormRoutingCuComponent>
> {
  sourceInfo = viewChild<TemplateRef<any>>("sourceInfo");
  leadInfo = viewChild<TemplateRef<any>>("leadInfo");
  assignToInfo = viewChild<TemplateRef<any>>("assignToInfo");
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-web-form-routings"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-web-form-routing"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-web-form-routing"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-web-form-routing"]),
    });

    this.dialogComponent = WebFormRoutingCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "lead_generation/web_form_routings",
        delete: "lead_generation/web_form_routings/delete",
      },
      indexTitle: this.translate.instant(_("web_form_routings")),
      indexIcon: "fas fa-window-maximize",
      createBtnLabel: this.translate.instant(_("create_web_form_routing")),
      indexTableKey: "WEB_FORM_ROUTINGS_KEY",
      columns: [
        {
          name: "id",
          title: this.translate.instant(_("id")),
          searchable: false,
          orderable: true,
        },
        {
          name: "form_id",
          title: this.translate.instant(_("source")),
          searchable: false,
          orderable: false,
          render: this.sourceInfo(),
        },
        {
          name: "interests",
          title: this.translate.instant(_("interests_tags")),
          searchable: false,
          orderable: false,
          render: this.leadInfo(),
        },
        {
          name: "assignment_rule",
          title: this.translate.instant(_("assign_to")),
          searchable: false,
          orderable: false,
          render: this.assignToInfo(),
        },
        {
          name: "creator.full_name",
          title: this.translate.instant(_("created_by")),
          searchable: false,
          orderable: false,
        },
        {
          name: "created_at",
          title: this.translate.instant(_("created_at")),
          searchable: false,
          orderable: false,
        },
      ],
    };
  }
}
