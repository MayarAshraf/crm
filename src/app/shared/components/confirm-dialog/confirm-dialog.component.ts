import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ConfirmDialogModule } from "primeng/confirmdialog";

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [ConfirmDialogModule, TranslateModule],
  template: `
    <p-confirmDialog
      #confirmDialog
      [key]="key()"
      [appendTo]="appendTo()"
      [styleClass]="'global-confirm-dialog ' + styleClass()"
      maskStyleClass="bg-blured"
    >
      <ng-template pTemplate="headless" let-message>
        <div class="confirm-icon">
          <i class="pi pi-question text-white text-2xl"></i>
        </div>
        <span class="flex align-items-center gap-2 mt-5">
          <i class="pi pi-exclamation-circle text-xl text-yellow-500"></i>
          <span class="font-bold text-xl">{{ message.header }}</span>
        </span>
        <span class="font-medium block text-center"> {{ message.message }}</span>
        <div class="w-full flex align-items-center gap-2 mt-4">
          <button
            pButton
            class="flex-1 py-1"
            [label]="'yes' | translate"
            (click)="confirmDialog.accept()"
          ></button>
          <button
            pButton
            class="p-button-outlined flex-1 py-1"
            [label]="'no' | translate"
            (click)="confirmDialog.reject()"
          ></button>
        </div>
      </ng-template>
    </p-confirmDialog>
  `,
  styles: `
    ::ng-deep {
      .global-confirm-dialog {
        align-items: center;
        padding: 1.5rem;
        background-color: var(--surface-overlay);
        width: min(95%, 320px);

        .confirm-icon {
          position: absolute;
          top: -35px;
          left: 50%;
          transform: translateX(-50%);

          display: flex;
          justify-content: center;
          align-items: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: var(--primary-color);
        }
      }

      .bg-blured {
        background-color: rgba(#fff, 0.5);
        backdrop-filter: blur(3px);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  key = input("globalConfirmDialogKey");
  appendTo = input<any>("body");
  styleClass = input<any>("");
}
