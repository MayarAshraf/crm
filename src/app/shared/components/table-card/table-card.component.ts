import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, output } from "@angular/core";
import { ConfirmService } from "@gService/confirm.service";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";
import { constants } from "src/app/shared/config";
import { TruncateTextPipe } from "../../pipes";

@Component({
  selector: "app-table-card",
  standalone: true,
  imports: [NgClass, TooltipModule, ButtonModule, DividerModule, TruncateTextPipe, TranslateModule],
  templateUrl: "./table-card.component.html",
  styleUrl: "./table-card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCardComponent {
  #confirmService = inject(ConfirmService);

  isListLayout = input(false);
  imgSrc = input<string>();
  title = input<string>();
  subtitle = input<string>();
  hint = input<string>();
  subtitleTooltip = input<string>();
  hintTooltip = input<string>();
  isClickable = input(false);
  isEditable = input(false);
  isDeletable = input(false);

  titleBtnClicked = output();
  updateBtnClicked = output();
  deleteBtnClicked = output();

  constants = constants;

  confirmDelete() {
    this.#confirmService.confirmDelete({
      acceptCallback: () => this.deleteBtnClicked.emit(),
    });
  }
}
