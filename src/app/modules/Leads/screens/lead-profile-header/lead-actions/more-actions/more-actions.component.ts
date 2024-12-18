import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { LeadCuComponent } from "@modules/Leads/screens/lead-cu.component";
import { LccaPermissionsService } from "@modules/Leads/services/lcca-permissions.service";
import { LeadsService } from "@modules/Leads/services/leads.service";
import { Lead } from "@modules/Leads/services/service-types";
import { SocialAccount } from "@modules/SocialAccounts/services/service-types";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { constants, createDialogConfig, GlobalActionService } from "@shared";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { MenuModule } from "primeng/menu";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-more-actions",
  standalone: true,
  template: `
    <button
      pButton
      type="button"
      (click)="menu.toggle($event)"
      icon="fas fa-ellipsis-vertical"
      [pTooltip]="'more_actions' | translate"
      tooltipPosition="top"
      class="p-2 p-button-outlined p-button-rounded text-sm w-2rem h-2rem"
    ></button>

    <p-menu #menu appendTo="body" [model]="moreOptions" [popup]="true"></p-menu>
  `,
  styles: `
    ::ng-deep {
      .blured-overlay {
        background-color: rgba(#000, 0.5);
        backdrop-filter: blur(4px);
      }
    }
  `,
  imports: [ButtonModule, TooltipModule, MenuModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoreActionsComponent extends GlobalActionService {
  #leadsService = inject(LeadsService);
  #dialogRef = inject(DynamicDialogRef);
  #dialogService = inject(DialogService);
  #lccaPermissions = inject(LccaPermissionsService);
  #translate = inject(TranslateService);
  #destroyRef = inject(DestroyRef);

  lead = model.required<Lead>();
  socialaccounts = input<SocialAccount[] | null>(null);

  dialogConfig = createDialogConfig({ width: "750px" });

  leadDialogConfig = computed(() => ({
    ...this.dialogConfig,
    maskStyleClass: "blured-overlay",
    data: { ...this.lead(), social_accounts: this.socialaccounts() },
  }));

  checkPermission(name: string) {
    return this.#lccaPermissions.checkPermission(this.lead().lead_type_id, name);
  }

  moreOptions: MenuItem[] = [];

  ngOnInit() {
    this.moreOptions = [
      {
        label: this.#translate.instant(_("edit_lead")),
        icon: constants.icons.pencil,
        visible: this.checkPermission("update-??"),
        command: () => {
          this.#dialogRef = this.#dialogService.open(LeadCuComponent, this.leadDialogConfig());
          // update ui here
          this.#dialogRef.onClose.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(lead => {
            if (!lead) return;
            this.lead.set(lead);
          });
        },
      },
      {
        label: this.#translate.instant(_("delete_lead")),
        icon: "fas fa-trash-alt",
        visible: this.checkPermission("delete-??"),
        command: () => {
          this.lead() && this.deleteAction("leads/leads/delete", null, this.lead().id);
        },
      },
      // {
      //   label: "Merge Lead",
      //   icon: "fas fa-object-group",
      //   visible: this.#userPermission.hasPermission(constants.permissions["merge-leads"]),
      //   command: () => {},
      // },
    ];
  }

  protected updateUi(): void {
    this.#dialogRef.close();
    this.lead() &&
      this.#leadsService.leadList.update(list =>
        list.filter(i => i.id !== (this.lead() as Lead).id),
      );
    this.#leadsService.totalLeads.update(value => value - 1);
    this.#leadsService.leadsFiltered.update(value => value - 1);
  }
}
