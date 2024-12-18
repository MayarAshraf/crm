import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CopyCodeDirective } from '../../directive/copy.code.directive';
import { HighlightCodeDirective } from '../../directive/highlight.code.directive';

@Component({
  selector: 'app-pre-code',
  standalone: true,
  imports: [HighlightCodeDirective, CopyCodeDirective, ButtonModule],
  template: `
  <div class="relative">
    <div class="absolute top-0 left-0 w-full h-2rem flex justify-content-end">
      <p-button appCopyCode icon="pi pi-copy" severity="secondary"></p-button>
    </div>
    <pre class="language-javascript code-pre">
      <code appHighlightCode class="language-javascript word-breack">{{code()}}</code>
    </pre>
  </div>
  `,
  styleUrl: './pre-code.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreCodeComponent {
  code = input<string>('');
}
