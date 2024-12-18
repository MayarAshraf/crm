import { NgStyle } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-view-report-card",
  standalone: true,
  imports: [RouterLink, NgStyle],
  template: `
    <a
      [routerLink]="link()"
      [ngStyle]="styleCard()"
      class="flex flex-column justify-content-center align-items-center py-8 px-4 h-full"
    >
      <i [class]="icon() + ' ' + 'text-4xl mb-2'"></i>
      <span class="mt-1">{{ label() }}</span>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewReportCardComponent {
  icon = input<string>("");
  label = input<string>("");
  link = input<string>("");
  styleCard = input<any>({});
}
