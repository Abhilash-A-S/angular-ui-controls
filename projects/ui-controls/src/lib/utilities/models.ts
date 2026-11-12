import { HighlightEntry } from "./input-rules";
/** An abbreviation with optional replacement text; unknown consumer metadata is retained. */
export interface AbbreviationEntry extends HighlightEntry {}
/** Menu data consumed by the action-menu component. */
export interface MenuItem {
  label?: string;
  value?: unknown;
  disabled?: boolean;
  svgIcon?: string;
  classname?: string;
  action?: unknown;
  rowData?: unknown;
  [key: string]: unknown;
}
/** Mention configuration accepted by the local highlighted textarea. */
export interface AbbreviationMentionConfig {
  items: any[];
  triggerChar?: string;
  labelKey?: string;
  isShortCut?: boolean;
  mentionSelect?: (item: any) => string;
}
export const ARABIC_LANGUAGE = "ar";
/** Moment-based day-month-year display and parse formats used by the date controls. */
export const DATE_FORMATS = {
  parse: { dateInput: "DD-MMM-YYYY" },
  display: {
    dateInput: "DD-MMM-YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
/** Moment-based date/time formats used by the combined picker. */
export const DATE_TIME_FORMATS = {
  parse: { dateInput: "DD-MMM-YYYY HH:mm" },
  display: {
    dateInput: "DD-MMM-YYYY HH:mm",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
