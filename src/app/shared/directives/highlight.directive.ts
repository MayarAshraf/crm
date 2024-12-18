import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  #el = inject(ElementRef);
  #renderer = inject(Renderer2);

  ngOnInit() {
    this.#renderer.addClass(this.#el.nativeElement, 'highlight-anim');
  };
}