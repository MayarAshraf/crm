import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { environment } from "@env";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  standalone: true,
  imports: [ButtonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  version = signal(environment.version);

  getCurrentYear() {
    return new Date().getFullYear();
  }
}
