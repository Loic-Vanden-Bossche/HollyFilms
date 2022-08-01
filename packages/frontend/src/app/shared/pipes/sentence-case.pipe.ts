import { Pipe, PipeTransform } from '@angular/core';

const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

@Pipe({
  name: 'sentencecase',
})
export class SentenceCasePipe implements PipeTransform {
  transform(value: any): any {
    return !isNaN(value) && typeof value !== 'string'
      ? value
      : capitalize(value);
  }
}
