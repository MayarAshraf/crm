import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortArray', standalone: true })

export class SortArrayPipe implements PipeTransform {
  transform(value: any[], property: string, order: 'asc' | 'desc' = 'asc'): any[] {
    if (!value) return [];
    return value.sort((a, b) => {
      if (order === 'asc') {
        return a[property] < b[property] ? -1 : 1;
      } else {
        return b[property] < a[property] ? -1 : 1;
      }
    });
  }
}
/*
<ul>
  <li *ngFor="let item of items | sortArray:'price':'asc'">
    {{ item.name }} - {{ item.price }}
  </li>
</ul>
*/