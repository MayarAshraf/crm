import { ComponentType } from "@angular/cdk/portal";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { PermissionsService } from "@gService/permissions.service";
import { About } from "@modules/About/services/service-types";
import { BaseIndexComponent, TableWrapperComponent, constants } from "@shared";
import { AboutCuComponent } from "./about-cu.component";
@Component({
  selector: "app-index-about",
  standalone: true,
  templateUrl: "/src/app/shared/components/base-index.component.html",
  imports: [TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexAboutComponent extends BaseIndexComponent<
  About,
  ComponentType<AboutCuComponent>
> {
  #userPermission = inject(PermissionsService);

  ngOnInit() {
    this.permissions.set({
      index: this.#userPermission.hasPermission(constants.permissions["index-about-sections"]),
      create: this.#userPermission.hasPermission(constants.permissions["create-about-section"]),
      update: this.#userPermission.hasPermission(constants.permissions["update-about-section"]),
      delete: this.#userPermission.hasPermission(constants.permissions["delete-about-section"]),
    });

    this.dialogComponent = AboutCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: "about/about-sections", delete: "about/about-sections/delete" },
      indexTitle: this.translate.instant(_("about_sections")),
      indexIcon: constants.icons.building,
      createBtnLabel: this.translate.instant(_("create_about_section")),
      indexTableKey: "ABOUT_KEY",
      columns: [
        { name: "id", title: this.translate.instant(_("id")), searchable: false, orderable: true },
        {
          name: "title",
          title: this.translate.instant(_("title")),
          searchable: true,
          orderable: false,
        },
        {
          name: "created_at",
          title: this.translate.instant(_("created_at")),
          searchable: false,
          orderable: true,
        },
      ],
    };
  }
}
