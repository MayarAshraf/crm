import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterArray', standalone: true })

export class FilterArrayPipe implements PipeTransform {
  transform(items: any[], property: string, filterValue: any): any[] {
    if (!items) return [];
    return items.filter(item => item[property] === filterValue);
  }
}

/*
<ul>
  <li *ngFor="let item of items | filterArray:'category':'Electronics'">{{ item.name }}</li>
</ul>
*/