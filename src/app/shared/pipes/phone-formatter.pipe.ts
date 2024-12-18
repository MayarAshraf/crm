import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneNumberFormatter', standalone: true })
export class PhoneNumberFormatterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value || value.length !== 11) return value;
    return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
  }
}

/*
<p>{{ '1234567890' | phoneNumberFormatter }}</p> // Output: "(123) 456-7890"
*/