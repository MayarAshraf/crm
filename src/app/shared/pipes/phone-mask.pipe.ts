import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneMask', standalone: true })
export class PhoneMaskPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const firstThreeDigits = value.slice(0, 3);
    const lastThreeDigits = value.slice(-3);
    const maskedDigits = '*'.repeat(value.length - 6);

    return `${firstThreeDigits}${maskedDigits}${lastThreeDigits}`;
  }
}
