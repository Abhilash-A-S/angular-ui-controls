import { NgModule, Pipe, PipeTransform } from "@angular/core";
import {
  InputRulesDirective,
  TrimLeadingSpaceDirective,
  DigitLimitDirective,
  ArabicInputDirective,
  EllipsisTooltipDirective,
  AutocompletePositionDirective,
} from "./input-utilities.directive";
import { PreventClipboardDirective } from "../directive/prevent-clipboard.directive";
import { AbbreviationTextareaComponent } from "./abbreviation-textarea.component";
import { filterOptions } from "./input-rules";
/** Case-insensitive local option filtering. Server-backed callers can pass an empty query. */
@Pipe({ name: "searchFilter", standalone: true })
export class SearchFilterPipe implements PipeTransform {
  transform<T>(
    items: readonly T[] | null | undefined,
    query: unknown,
    key = "",
    startsWith = false,
  ): T[] {
    return filterOptions(items, query, key, startsWith);
  }
}
const UTILITIES = [
  InputRulesDirective,
  TrimLeadingSpaceDirective,
  DigitLimitDirective,
  ArabicInputDirective,
  EllipsisTooltipDirective,
  AutocompletePositionDirective,
  PreventClipboardDirective,
  AbbreviationTextareaComponent,
  SearchFilterPipe,
];
/** Internal shared template utilities; all implementations are shipped with this package. */
@NgModule({ imports: UTILITIES, exports: UTILITIES })
export class UiUtilitiesModule {}
