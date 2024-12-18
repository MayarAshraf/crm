import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "initials", standalone: true })
export class InitialsPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return "";

    const hasArabic = /[\u0600-\u06FF]/.test(value); // Check if the value contains Arabic characters
    const valueParts = value.split(" ");

    return valueParts
      .slice(0, 2) // Take only the first two parts
      .map(part => part[0]?.toUpperCase())
      .join(hasArabic ? " " : "");
  }
}

/*
<p>{{ 'John Doe' | initials }}</p> // Output: "JD"
initials means ==> "الأحرف الأولى"
*/
