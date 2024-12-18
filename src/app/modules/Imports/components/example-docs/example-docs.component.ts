import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { DialogModule } from "primeng/dialog";

@Component({
  selector: "app-example-docs",
  standalone: true,
  imports: [DialogModule],
  templateUrl: "./example-docs.component.html",
  styles: `dt { font-weight: 700 }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleDocsComponent {
  visible = model.required<boolean>();
  docsType = input.required<"units" | "leads">();
}
