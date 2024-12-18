import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-inventory",
  standalone: true,
  imports: [],
  templateUrl: "./broker-inventory.component.html",
  styleUrls: ["./broker-inventory.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InventoryComponent {}
