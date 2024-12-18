import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'percentChange', standalone: true })

export class PercentChangePipe implements PipeTransform {
  transform(currentValue: number, previousValue: number): string {
    if (isNaN(currentValue) || isNaN(previousValue)) return '';

    const change = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
    const sign = change >= 0 ? '+' : '-';
    return `${sign}${change.toFixed(2)}%`;
  }
}

/*
<p>{{ 85 | percentChange:100 }}</p> // Output: "-15.00%"
*/