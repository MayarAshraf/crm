import { AsyncPipe, NgClass, NgStyle } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChild,
  inject,
  input,
  output,
} from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { Observable } from "rxjs";
import { DefaultScreenHeaderComponent } from "../default-screen-header.component";
import { SpinnerComponent } from "../spinner.component";

@Component({
  selector: "app-dynamic-dialog",
  templateUrl: "./dynamic-dialog.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgStyle, AsyncPipe, SpinnerComponent, DefaultScreenHeaderComponent],
})
export class DynamicDialogComponent {
  #dialogRef = inject(DynamicDialogRef);

  extraContentTemplate = contentChild<TemplateRef<any>>("extraContent");
  headerContentTemplate = contentChild<TemplateRef<any>>("headerContent");

  dialogData$ = input<Observable<any>>();
  showDialogHeader = input(true);
  isTitleRenderedAsBtn = input(false);
  dialogTitle = input("");
  withPadding = input(true);
  titleClass = input("");
  subtitle = input("");
  titleIcon = input("");
  isHeaderSticky = input(true);
  onTitleBtnClicked = output();

  closeDialog(): void {
    this.#dialogRef.close();
  }
}
