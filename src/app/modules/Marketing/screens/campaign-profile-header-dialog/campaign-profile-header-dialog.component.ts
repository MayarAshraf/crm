import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { Campaign } from "@modules/Marketing/services/service-types";
import { TranslateModule } from "@ngx-translate/core";
import {
  CachedListsService,
  constants,
  createDialogConfig,
  PermissioneVisibilityDirective,
  PermissionsService,
} from "@shared";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { MenuModule } from "primeng/menu";
import { TooltipModule } from "primeng/tooltip";
import { CampaignCuComponent } from "../campaign-cu.component";

@Component({
  selector: "app-campaign-profile-header-dialog",
  standalone: true,
  imports: [
    TooltipModule,
    PermissioneVisibilityDirective,
    ButtonModule,
    MenuModule,
    TranslateModule,
  ],
  templateUrl: "./campaign-profile-header-dialog.component.html",
  styleUrl: "./campaign-profile-header-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignProfileHeaderDialogComponent {
  #dialogRef = inject(DynamicDialogRef);
  #dialogService = inject(DialogService);
  constants = constants;
  #userPermission = inject(PermissionsService);
  #cachedLists = inject(CachedListsService);

  campaign = input.required<Campaign>();
  editData = input.required<Campaign>();

  dialogConfig = createDialogConfig({ width: "500px" });
  permissions = signal({
    update: this.#userPermission.hasPermission(constants.permissions["update-campaign"]),
  });

  campaignStatus = computed(
    () =>
      this.#cachedLists
        .loadLists()
        .get("marketing:campaign_statuses")
        ?.find((item: { value: number }) => item.value == this.campaign().campaign_status_id)
        ?.label,
  );
  campaignsTypes = computed(
    () =>
      this.#cachedLists
        .loadLists()
        .get("marketing:campaigns_types")
        ?.find((item: { value: number }) => item.value == this.campaign().campaign_type_id)?.label,
  );

  print() {
    window.print();
  }

  ngOnInit() {
    this.#cachedLists.updateLists(["marketing:campaigns_types", "marketing:campaigns_statuses"]);
  }

  updateCmpaign() {
    const dialogConfig = { ...this.dialogConfig, data: this.editData() };
    this.#dialogRef.close();
    this.#dialogRef = this.#dialogService.open(CampaignCuComponent, dialogConfig);
  }

  closeDialog = output();
}
