import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "arrayShuffle", standalone: true })
export class ArrayShufflePipe implements PipeTransform {
  transform(array: any[]): any[] {
    if (!array) return [];

    let currentIndex = array.length,
      randomIndex,
      temporaryValue;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}

/*
<li *ngFor="let item of items | arrayShuffle">{{ item }}</li>
Shuffle means ==> "خلط"
*/
