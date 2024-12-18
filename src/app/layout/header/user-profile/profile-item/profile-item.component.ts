import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ProfileItem } from "../user-profile.component";

@Component({
  selector: "app-profile-item",
  standalone: true,
  imports: [ButtonModule, RouterLink, RouterLinkActive],
  templateUrl: "./profile-item.component.html",
  styleUrls: ["./profile-item.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileItemComponent {
  item = input<ProfileItem>({} as ProfileItem);
  onClick = output<any>();
}
