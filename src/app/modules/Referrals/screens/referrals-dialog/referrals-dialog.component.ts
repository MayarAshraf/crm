import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { DynamicDialogComponent } from "@shared";
import { ButtonModule } from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: "app-referrals-dialog",
  standalone: true,
  imports: [DynamicDialogComponent, ButtonModule, TranslateModule],
  templateUrl: "./referrals-dialog.component.html",
  styleUrl: "./referrals-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferralsDialogComponent {
  #dialogConfig = inject(DynamicDialogConfig);
  dialogRef = inject(DynamicDialogRef);

  editData = this.#dialogConfig.data;
}
