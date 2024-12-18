import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, TemplateRef, inject, viewChild } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { TranslateModule } from "@ngx-translate/core";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { FblgiRoutingCuComponent } from "./fblgi-routings-cu.component";

@Component({
  selector: "app-fblgi-routing-index",
  standalone: true,
  templateUrl: "./fblgi-routings.component.html",
  imports: [TableWrapperComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexFblgiRoutingComponent extends BaseIndexComponent<
  any,
  ComponentType<FblgiRoutingCuComponent>
> {
  #userPermission = inject(PermissionsService);

  sourceInfo = viewChild<TemplateRef<any>>("sourceInfo");
  leadInfo = viewChild<TemplateRef<any>>("leadInfo");
  assignToInfo = viewChild<TemplateRef<any>>("assignToInfo");

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-fblgi-routings"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-fblgi-routing"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-fblgi-routing"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-fblgi-routing"]),
    });

    this.dialogComponent = FblgiRoutingCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: "lead_generation/fblgi_routings",
        delete: "lead_generation/fblgi_routings/delete",
      },
      indexTitle: this.translate.instant(_("facebook_lead_generation_routings")),
      indexIcon: "fab fa-facebook",
      createBtnLabel: this.translate.instant(_("create_fblgi_routing")),
      indexTableKey: "FBLGI_ROUTINGS_KEY",
      columns: [
        { name: "id", title: this.translate.instant(_("id")), searchable: false, orderable: true },
        {
          name: "identifier_id",
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
