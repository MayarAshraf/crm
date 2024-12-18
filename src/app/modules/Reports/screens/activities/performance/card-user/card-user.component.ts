import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";

@Component({
  selector: "app-card-user",
  standalone: true,
  imports: [CardModule, RouterLink, ButtonModule, AvatarModule, AvatarGroupModule],
  templateUrl: "./card-user.component.html",
  styleUrl: "./card-user.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardUserComponent {
  fullName = input.required<string>();
  id = input.required<number>();
  srcImage = input<string>("");
  jobTitle = input<string>("");
  joinData = input<string>("");
  lastLogin = input<string>("");
  group = input<string>("");
}
