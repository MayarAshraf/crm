import { NgClass, NgTemplateOutlet, SlicePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, HostListener, input, model } from "@angular/core";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { ListOption } from "../services";

@Component({
  selector: "app-avatar-list",
  standalone: true,
  template: `
    @if (items() && items().length === 1) {
      <ng-container *ngTemplateOutlet="avatar; context: { $implicit: items()[0] }" />
    } @else {
      <p-avatarGroup>
        @for (item of items() | slice: 0 : sliceCount(); track $index) {
          <ng-container *ngTemplateOutlet="avatar; context: { $implicit: item }" />
        }

        @if (showAllAvatars()) {
          @for (item of items() | slice: sliceCount(); track $index) {
            <ng-container *ngTemplateOutlet="avatar; context: { $implicit: item }" />
          }
        }

        @if (items().length > sliceCount()) {
          <p-avatar shape="circle">
            <button
              pButton
              class="p-0 p-button-rounded text-xs w-full h-full transition-none"
              [ngClass]="{
                'p-button-danger': !showAllAvatars(),
                'p-button-success': showAllAvatars()
              }"
              (click)="showAllAvatars.set(!showAllAvatars())"
              label="{{ showAllAvatars() ? '-' : '+' }}{{ items().length - sliceCount() }}"
            ></button>
          </p-avatar>
        }
      </p-avatarGroup>
    }

    <ng-template #avatar let-item>
      <p-avatar
        shape="circle"
        image="assets/media/icons/avatar.jpg"
        [pTooltip]="item.label"
        tooltipPosition="top"
      ></p-avatar>
    </ng-template>
  `,
  styles: `:host { font-size: 0 }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    SlicePipe,
    ButtonModule,
    TooltipModule,
    AvatarModule,
    AvatarGroupModule,
    NgTemplateOutlet,
  ],
})
export class AvatarListComponent {
  items = model.required<ListOption[]>();
  sliceCount = input(2);
  showAllAvatars = model(false);

  @HostListener("mouseenter")
  onMouseEnter() {
    this.showAllAvatars.set(true);
  }

  @HostListener("mouseleave")
  onMouseLeave() {
    this.showAllAvatars.set(false);
  }
}
