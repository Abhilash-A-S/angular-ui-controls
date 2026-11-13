import { MatDatepickerInputEvent } from '@angular/material/datepicker';

/**
 * Identifies which date field triggered the event
 */
export type DateType = 'START_DATE' | 'END_DATE';

/**
 * Common date range field information
 */
export interface DateRangeFieldInfo {
  /** Start date value */
  startDate: Date | null;

  /** End date value */
  endDate: Date | null;

  /** Field name provided by parent */
  fieldName: string | number;
}

/**
 * Datepicker change event payload
 */
export interface DateRangeDateChangeEvent extends DateRangeFieldInfo {
  dateType: DateType;
  dateChangeEvent: any;
}

/**
 * ngModel change event payload
 */
export interface DateRangeModelChangeEvent extends DateRangeFieldInfo {
  dateType: DateType;
  modelChangeEvent: Date;
}

/**
 * Focus event payload
 */
export interface DateRangeFocusEvent extends DateRangeFieldInfo {
  dateType: DateType;
  onFocusEvent: FocusEvent;
}

/**
 * Blur event payload
 */
export interface DateRangeBlurEvent extends DateRangeFieldInfo {
  dateType: DateType;
  blurEvent: FocusEvent;
}

/**
 * Input event payload
 */
export interface DateRangeInputEvent extends DateRangeFieldInfo {
  dateType: DateType;
  inputChangeEvent: Event;
}

/**
 * Native change event payload
 */
export interface DateRangeChangeEvent extends DateRangeFieldInfo {
  dateType: DateType;
  changeEvent: Event;
}

/**
 * Keyup event payload
 */
export interface DateRangeKeyupEvent extends DateRangeFieldInfo {
  dateType: DateType;
  keyUpEvent: KeyboardEvent;
}
/**
 * Keyup event payload
 */
export interface DateRangeEnterEvent extends DateRangeFieldInfo {
  dateType: DateType;
  keyUpEvent: KeyboardEvent;
}

/**
 * Keydown event payload
 */
export interface DateRangeKeydownEvent extends DateRangeFieldInfo {
  dateType: DateType;
  keyDownEvent: KeyboardEvent;
}
