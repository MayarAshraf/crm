import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CachedLabelsService, CachedListsService, MediaListComponent } from "@shared";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ImageModule } from "primeng/image";
import { TabViewModule } from "primeng/tabview";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-resource-view",
  templateUrl: "./resource-view.component.html",
  styleUrls: ["./resource-view.component.scss"],
  standalone: true,
  imports: [
    ButtonModule,
    TooltipModule,
    DividerModule,
    ImageModule,
    TabViewModule,
    TranslateModule,
    MediaListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceViewComponent {
  #dialogRef = inject(DynamicDialogRef);
  #dialogConfig = inject(DynamicDialogConfig);
  #cachedLabels = inject(CachedLabelsService);
  #translate = inject(TranslateService);
  #cachedLists = inject(CachedListsService);

  resource = signal(this.#dialogConfig.data);
  activeIndex = signal(0);
  mediaLength = computed(() => this.resource().media.length);

  ngOnInit() {
    this.resource().resource_type_id && this.#cachedLists.updateLists(["resources:resource_types"]);
  }

  getLabelById(listKey: string, id: number | null) {
    return this.#cachedLabels.getLabelById(listKey, id as number);
  }

  tabsItems = computed<MenuItem[]>(() => [
    {
      label: this.#translate.instant(_("info")),
      tooltip: this.#translate.instant(_("info")),
      icon: "fas fa-info-circle",
      index: 0,
    },
    {
      label: this.#translate.instant(_("attachments")),
      tooltip: this.#translate.instant(_("attachments")),
      icon: "fas fa-paperclip",
      index: 1,
      badgeNumber: this.resource().media.length,
    },
  ]);

  closeDialog() {
    this.#dialogRef.close(this.resource());
  }

  ngOnDestroy() {
    this.closeDialog();
  }
}
