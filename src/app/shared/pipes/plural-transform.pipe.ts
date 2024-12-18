import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'plural', standalone: true })

export class PluralPipe implements PipeTransform {
  transform(value: string): string {
    return value.endsWith('y') ? value.slice(0, -1) + 'ies' :
      value.endsWith('s') ? value + 'es' :
      value + 's';
  };
}