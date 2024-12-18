import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "parseNumberOnly",
  standalone: true,
})
export class ParseNumberOnlyPipe implements PipeTransform {
  transform(value: string): number {
    return parseFloat(value.replace(/[^-\d.]/g, ""));
  }
}
