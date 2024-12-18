import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "randomColor",
  standalone: true,
})
export class RandomColorPipe implements PipeTransform {
  transform(value: string): string {
    const h = Math.floor(Math.random() * 360); // Hue: 0-359 degrees
    const s = Math.floor(Math.random() * 20) + 70; // Saturation: 70% - 90%
    const l = Math.floor(Math.random() * 20) + 30; // Lightness: 30% - 50%
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
}
