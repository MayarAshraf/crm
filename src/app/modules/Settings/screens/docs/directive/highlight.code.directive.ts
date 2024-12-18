import { Directive, ElementRef, inject } from '@angular/core';
import * as Prism from 'prismjs';

@Directive({
  selector: '[appHighlightCode]',
  standalone: true
})
export class HighlightCodeDirective {
  #el = inject(ElementRef);

  ngAfterViewInit() {
    Prism.highlightElement(this.#el.nativeElement);
  }
}