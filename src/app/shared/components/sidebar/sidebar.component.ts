import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChild,
  inject,
  model,
} from "@angular/core";
import { LangService } from "@gService/lang.service";
import { TranslateModule } from "@ngx-translate/core";
import { SidebarModule } from "primeng/sidebar";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [NgTemplateOutlet, SidebarModule, TranslateModule],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  currentLang = inject(LangService).currentLanguage;

  sidebarContentTemplete = contentChild<TemplateRef<any>>("sidebarContentTemplete");
  footerTemplete = contentChild<TemplateRef<any>>("footerTemplete");
  contentTemplete = contentChild<TemplateRef<any>>("contentTemplete");

  showSidebar = model<boolean>(false);
}
