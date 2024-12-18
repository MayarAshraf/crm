import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'urlify', standalone: true })

export class URLifyPipe implements PipeTransform {
  transform(input: string): string {
    if (!input) return '';
    return input
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ''); // Remove non-word characters except hyphens
  }
}

/*
{{ 'This is a URL-friendly title!' | urlify }} // Output: "this-is-a-url-friendly-title"
*/