import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isEmpty',
  pure: true,
  standalone: true,
})
export class IsEmptyPipe implements PipeTransform {
  transform(value: any): boolean {
    if (value === null || value === undefined) {
      return true;
    }
    if (typeof value === 'string') {
      return !value.trim();
    }
    if (Array.isArray(value)) {
      return !value.length;
    }
    if (typeof value === 'object') {
      return !Object.keys(value)?.length;
    }
    return false;
  }
}
