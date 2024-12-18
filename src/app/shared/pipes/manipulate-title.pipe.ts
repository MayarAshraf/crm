import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'manipulateTitle', standalone: true })

export class ManipulateTitlePipe implements PipeTransform {
  // CSV stands for Comma-Separated Values.
  transform(title: string): string {
    let splitArray = title.split('_');

    if (title.endsWith('_id') && !title.startsWith('national')) {
      splitArray.pop(); // Remove the last element
    }
    return splitArray.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
/*
 contact_method_id it will be transform Contact Method
*/