import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Campaign } from "@modules/Marketing/services/service-types";
import { CacheService, DynamicDialogComponent } from "@shared";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { BehaviorSubject, tap } from "rxjs";
import { CampaignProfileHeaderDialogComponent } from "../campaign-profile-header-dialog/campaign-profile-header-dialog.component";
import { CampaignProfileTabsComponent } from "../campaign-profile-tabs/campaign-profile-tabs.component";
import { ButtonModule } from "primeng/button";
@Component({
  selector: "app-campaign-profile-dialog",
  standalone: true,
  imports: [
    AsyncPipe,
    ButtonModule,
    DynamicDialogComponent,
    CampaignProfileTabsComponent,
    CampaignProfileHeaderDialogComponent,
  ],
  templateUrl: "./campaign-profile-dialog.component.html",
  styleUrl: "./campaign-profile-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignProfileDialogComponent {
  #dialogConfig = inject(DynamicDialogConfig);
  #dialogRef = inject(DynamicDialogRef);
  #cacheService = inject(CacheService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  editData: Campaign = this.#dialogConfig.data;
  campaign = signal({} as Campaign);
  dialogData$ = new BehaviorSubject(false);

  campaignDetails$ = this.#cacheService
    .getData(`marketing/campaigns/show/${this.editData.id}`, "post", {}, undefined, undefined, "v2")
    .pipe(
      tap(campaign => {
        this.campaign.set(campaign);
        this.dialogData$.next(true);
      }),
      takeUntilDestroyed(this.#destroyRef),
    )
    .subscribe();

  closeDialog() {
    this.#dialogRef.close();
  }
}
