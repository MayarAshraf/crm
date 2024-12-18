import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ordinalNumber', standalone: true })

export class OrdinalNumberPipe implements PipeTransform {
  transform(number: number): string {
    if (isNaN(number)) return '';

    const lastDigit = number % 10;
    if (lastDigit === 1 && number !== 11) {
      return number + 'st';
    } else if (lastDigit === 2 && number !== 12) {
      return number + 'nd';
    } else if (lastDigit === 3 && number !== 13) {
      return number + 'rd';
    } else {
      return number + 'th';
    }
  }
}

/*
{{ 1 | ordinalNumber }} // Output: "1st"
{{ 22 | ordinalNumber }} // Output: "22nd"
{{ 13 | ordinalNumber }} // Output: "13th"
{{ 7 | ordinalNumber }} // Output: "7th"
*/