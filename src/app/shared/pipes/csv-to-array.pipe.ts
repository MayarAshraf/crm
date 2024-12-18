import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'csvToArray', standalone: true })

export class CSVToArrayPipe implements PipeTransform {
  // CSV stands for Comma-Separated Values.
  transform(csvData: string): string[] {
    if (!csvData) return [];

    // Split the CSV string into an array
    return csvData.split(',');
  }
}

/*
<li *ngFor="let item of 'apple,banana,cherry' | csvToArray">{{ item }}</li>
*/