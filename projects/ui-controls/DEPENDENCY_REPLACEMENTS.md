# Local utility replacements

The private utility dependency has been removed from source and package configuration. Its source was unavailable, so behavior is defined by the implementations and tests in this repository.

| Feature | Local implementation | Defined behavior |
| --- | --- | --- |
| Option filtering | `filterOptions`, `SearchFilterPipe` | Case-insensitive contains/starts-with, object label keys, null-safe lists |
| Numeric/text input | `InputRulesDirective` | Typing/paste normalization; integer/fraction limits; optional negatives; min/max clamp on blur |
| Leading whitespace | `TrimLeadingSpaceDirective` | Removes leading whitespace; preserves internal spaces |
| Clipboard control | `PreventClipboardDirective` | Blocks selected copy/cut/paste interactions when enabled; existing component flags now connect to it |
| Hours/minutes digits | `DigitLimitDirective` | Decimal digits with a configurable length limit |
| Arabic input | `ArabicInputDirective` | Unshifted Latin-key mapping to Arabic keyboard characters; native Arabic/IME input passes through; this is not translation or transliteration |
| Overflow tooltips | `EllipsisTooltipDirective` | Material tooltip when the host box overflows |
| Autocomplete positioning | `AutocompletePositionDirective` | Reposition on window resize/scroll using Material's public trigger API |
| Date formats | `DATE_FORMATS`, `DATE_TIME_FORMATS` | Moment formats `DD-MMM-YYYY` and `DD-MMM-YYYY HH:mm` |
| Abbreviation text | `AbbreviationTextareaComponent` | Safe literal whole-word highlighting, editable textarea, form integration and mention suggestions |
| Shared types | `models.ts` | Locally declared menu entries, abbreviation entries and mention configuration |

## Highlighted textarea details

- Entries identify their word through `abbreviation`, `word`, or `text`, in that order.
- Matching is case-insensitive; restricted words take priority when both lists contain the same word.
- Restricted words are highlighted, not blocked. No undisclosed enforcement rule is inferred.
- Text is rendered through interpolation, never arbitrary innerHTML.
- Mention configuration accepts `items`, `triggerChar`, `labelKey`, and `mentionSelect`. The legacy `isShortCut` field is retained as data, but no shortcut behavior is implemented because its original meaning is unknown.
- The original highlighted-textarea appearance and interaction details cannot be guaranteed without its source or examples.

## Remaining host responsibilities

Several original components reference SVG icon names (such as `uploadIcon` and `closeIcon`) and CSS utility classes. Consumers must supply matching registered icons and styles. The demo provides basic layout styling but does not reconstruct the original application theme or icon collection.

The existing rich-text editor dependency and Moment are retained. The demo build emits CommonJS optimization warnings for them. Package splitting or replacing the editor can be considered separately.
