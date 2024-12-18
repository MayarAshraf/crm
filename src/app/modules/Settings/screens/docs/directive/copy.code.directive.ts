import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { AlertService } from '@shared';

@Directive({
  selector: '[appCopyCode]',
  standalone: true,
})
export class CopyCodeDirective {
  #alert = inject(AlertService);
  #el = inject(ElementRef);

  code = input<string>('', { alias: 'appCopyCode' });

  @HostListener('click')
  copyCode() {
    const codeElement = this.#el.nativeElement.parentElement.nextElementSibling.firstElementChild;
    const range = document.createRange();
    range.selectNode(codeElement);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
    this.#alert.setMessage({ severity: "success", detail: `Code has been copied` });
  }
}