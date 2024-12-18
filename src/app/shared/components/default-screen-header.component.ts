import { NgClass, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, TemplateRef, input, output } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";

@Component({
  selector: "app-default-screen-header",
  template: `
    <div class="flex flex-wrap align-items-center justify-content-between gap-2">
      @if (isTitleRenderedAsBtn()) {
        <button
          pButton
          class="p-button-link p-0 text-primary text-lg"
          [ngClass]="titleClass()"
          (click)="onTitleBtnClicked.emit()"
          [icon]="titleIcon()"
          [label]="title()"
        ></button>
      } @else {
        <div class="flex flex-wrap align-items-center gap-2">
          <h2
            [class]="titleClass()"
            [ngClass]="{
              'font-semibold capitalize text-lg line-height-2 my-0': withDefaultTitleClass()
            }"
          >
            <i [class]="titleIcon() + ' text-base'"></i> {{ title() }}
            @if (subtitle()) {
              <span class="block text-sm font-medium text-primary">{{ subtitle() }}</span>
            }
          </h2>
          <ng-container *ngTemplateOutlet="extraContent()"></ng-container>
        </div>
      }

      <div class="flex align-items-center gap-1">
        <ng-container *ngTemplateOutlet="headerContent()"></ng-container>

        @if (displayButton()) {
          <button
            pButton
            [ngClass]="buttonClass()"
            (click)="onClick.emit()"
            [icon]="buttonIcon()"
            [label]="buttonLabel()"
          ></button>
        }
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, CardModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultScreenHeaderComponent {
  extraContent = input<TemplateRef<any> | null>(null);
  headerContent = input<TemplateRef<any> | null>(null);

  isTitleRenderedAsBtn = input(false);
  title = input("");
  subtitle = input("");
  titleIcon = input("");
  withDefaultTitleClass = input(true);
  titleClass = input("");
  displayButton = input(true);
  buttonClass = input("");
  buttonLabel = input("");
  buttonIcon = input("pi pi-plus");
  onClick = output();
  onTitleBtnClicked = output();
}
