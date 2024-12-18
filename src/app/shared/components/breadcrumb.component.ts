import { NgTemplateOutlet, TitleCasePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { BreadcrumbService } from "../services";

@Component({
  selector: "app-breadcrumb",
  standalone: true,
  imports: [TitleCasePipe, RouterLink, NgTemplateOutlet, TranslateModule],
  template: `
    @if (breadcrumbs().length) {
      <nav aria-label="breadcrumb">
        <ol class="list-none p-0 mt-0 flex flex-wrap">
          @for (breadcrumb of breadcrumbs(); track $index; let last = $last) {
            <li class="text-xs font-semibold">
              @if (!last) {
                <a [routerLink]="breadcrumb.url" class="text-primary">
                  <ng-container
                    *ngTemplateOutlet="breadcrumbItem; context: { $implicit: breadcrumb }"
                  ></ng-container>
                </a>
                <span class="flex-shrink-0 mx-2 text-primary">
                  <i class="fas fa-chevron-right"></i>
                </span>
              } @else {
                <span class="text-500 font-bold">
                  <ng-container
                    *ngTemplateOutlet="breadcrumbItem; context: { $implicit: breadcrumb }"
                  ></ng-container>
                </span>
              }
            </li>
          }
        </ol>
        <ng-template #breadcrumbItem let-breadcrumb>
          @if (breadcrumb.icon) {
            <i [class]="breadcrumb.icon + ' text-xs'"></i>
          }
          {{ breadcrumb.label | translate | titlecase }}
        </ng-template>
      </nav>
    }
  `,
})
export class BreadcrumbComponent {
  breadcrumbs = inject(BreadcrumbService).breadcrumbs;
}
