import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "kebabCase", standalone: true })
export class KebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/\//g, "-").replace(/\s+/g, "-");
  }
}
/*
  Company Size to company-size
*/
