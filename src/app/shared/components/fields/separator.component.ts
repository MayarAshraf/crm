import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FieldType, FieldTypeConfig } from "@ngx-formly/core";
import { SafeContentPipe } from "../../pipes";

@Component({
  selector: "formly-separator-field",
  template: `
    <div class="border-1 border-200"></div>
    <h2 class="flex align-items-center gap-2 text-800 text-base font-medium">
      @if (props.svg) {
        <span
          class="line-height-1 font-size-0"
          [innerHTML]="props.svg | safeContent: 'html'"
        ></span>
      } @else {
        <i [class]="props.icon"></i>
      }
      {{ props.title }}
    </h2>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SafeContentPipe],
})
export class SeparatorComponent extends FieldType<FieldTypeConfig> {}
