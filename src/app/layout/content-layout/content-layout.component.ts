import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "@layout/footer/footer.component";
import { HeaderComponent } from "@layout/header/header.component";
import { BreadcrumbComponent } from "@shared";

@Component({
  selector: "app-content-layout",
  templateUrl: "./content-layout.component.html",
  styleUrls: ["./content-layout.component.scss"],
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet, BreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContentLayoutComponent {}
