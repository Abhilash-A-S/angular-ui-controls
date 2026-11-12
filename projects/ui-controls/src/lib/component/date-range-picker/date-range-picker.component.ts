import { Component, EventEmitter, Input, Output, Optional, Self, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AutoPopulateCurrentDateDirective } from '../../directive/auto-populate-current-date.directive';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { DATE_FORMATS, UiUtilitiesModule } from '../../utilities';
import {
  DateRangeBlurEvent,
  DateRangeChangeEvent,
  DateRangeDateChangeEvent,
  DateRangeEnterEvent,
  DateRangeFieldInfo,
  DateRangeFocusEvent,
  DateRangeInputEvent,
  DateRangeKeydownEvent,
  DateRangeKeyupEvent,
  DateRangeModelChangeEvent,
  DateType
} from './date-range.interface';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'ui-date-range-picker', // Component selector
  standalone: true,
  imports: [
    MaterialModule,
    UiUtilitiesModule,
    MatMomentDateModule,
    AutoPopulateCurrentDateDirective],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }]
})
export class DateRangePickerComponent extends BaseControlValueAccessor<any> {
  // Reference to mat-date-range-picker
  @ViewChild('dateRangePicker') dateRangePicker?: MatDateRangePicker<any>;

  // Start date input ID
  protected rawInputIdFrom: string = '';
  protected rawInputIdTo: string = '';

  public effectiveIdFrom: string = '';
  public effectiveIdTo: string = '';

  /**
   * Identifier for the range start input, combined with idPrefix when supplied.
   * @type string
   * @remarks Required Angular input; provide a stable identifier.
   * @renamedFrom inputIdFrom
   */
  @Input({ required: true })
  set startInputId(id: string) {
    this.rawInputIdFrom = id || '';
    this.configureRangeIds();
  }
  get startInputId(): string {
    return this.rawInputIdFrom;
  }

  /**
   * Identifier for the range end input, combined with idPrefix when supplied.
   * @type string
   * @remarks Required Angular input; provide a stable identifier.
   * @renamedFrom inputIdTo
   */
  @Input({ required: true })
  set endInputId(id: string) {
    this.rawInputIdTo = id || '';
    this.configureRangeIds();
  }
  get endInputId(): string {
    return this.rawInputIdTo;
  }

  public override configureId(): void {
    this.configureRangeIds();
  }

  private configureRangeIds(): void {
    this.effectiveIdFrom = this.rawIdPrefix && this.rawInputIdFrom 
      ? `${this.rawIdPrefix}_${this.rawInputIdFrom}` 
      : this.rawInputIdFrom;
    this.effectiveIdTo = this.rawIdPrefix && this.rawInputIdTo 
      ? `${this.rawIdPrefix}_${this.rawInputIdTo}` 
      : this.rawInputIdTo;
  }

  /**
   * Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true.
   * @default false
   * @type boolean
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() preventCopyPasteCut: boolean = false;

  /**
   * Label text or translation key displayed for this control.
   * @default ''
   * @type string
   */
  @Input() label: string = '';

  // Start date value
  get startModelValue(): Date | null {
    return this.value?.start || null;
  }
  set startModelValue(val: Date | null) {
    this.value = { start: val, end: this.value?.end || null };
  }

  // End date value
  get endModelValue(): Date | null {
    return this.value?.end || null;
  }
  set endModelValue(val: Date | null) {
    this.value = { start: this.value?.start || null, end: val };
  }

  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(ngControl, changeDetectorRef);
  }

  /**
   * Error message displayed for validation
   * @default ''
   * @type string
   */
  @Input() errorMessage: string = '';

  /**
   * Marks this control as required in its existing template; parent-form validators remain separately configured.
   * @default false
   * @type boolean
   */
  @Input() required: boolean = false;

  /**
   * Disable start date input
   * @default false
   * @type boolean
   */
  @Input() startDisabled: boolean = false;

  /**
   * Disable end date input
   * @default false
   * @type boolean
   */
  @Input() endDisabled: boolean = false;

  /**
   * Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved.
   * @type string | number
   * @renamedFrom textFieldName
   */
  @Input() fieldName!: string | number;

  /**
   * Placeholder for start date input
   * @default ''
   * @type string
   */
  @Input() startPlaceholder: string = '';

  /**
   * Placeholder for end date input
   * @default ''
   * @type string
   */
  @Input() endPlaceholder: string = '';

  /**
   * Makes end date input read-only
   * @default false
   * @type boolean
   */
  @Input() endReadonly: boolean = false;

  /**
   * Makes start date input read-only
   * @default false
   * @type boolean
   */
  @Input() startReadonly: boolean = false;

  /**
   * Automatically populate current date
   * @default true
   */
  @Input() autoPopulateDateTime = true;

  /**
   * Minimum allowed start date
   * @type Date
   */
  @Input() startMinDate!: Date;

  /**
   * Maximum allowed start date
   * @type Date
   */
  @Input() startMaxDate!: Date;

  /**
   * Minimum allowed end date
   * @type Date
   */
  @Input() endMinDate!: Date;

  /**
   * Maximum allowed end date
   * @type Date
   */
  @Input() endMaxDate!: Date;

  /**
   * Emits when the component model-change handler runs.
   * @payload DateRangeModelChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onModelChange
   */
  @Output() modelChange: EventEmitter<DateRangeModelChangeEvent> = new EventEmitter<DateRangeModelChangeEvent>();

  /**
   * Emits from the existing change handler.
   * @payload DateRangeChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onChange
   */
  @Output() changeCommitted: EventEmitter<DateRangeChangeEvent> = new EventEmitter<DateRangeChangeEvent>();

  /**
   * Emits from the existing input/change handler.
   * @payload DateRangeInputEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onInputChange
   */
  @Output() inputChanged: EventEmitter<DateRangeInputEvent> = new EventEmitter<DateRangeInputEvent>();

  /**
   * Emits when the inner field gains focus.
   * @payload DateRangeFocusEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onFocusChange
   */
  @Output() focusGained: EventEmitter<DateRangeFocusEvent> = new EventEmitter<DateRangeFocusEvent>();

  /**
   * Emits when the inner field loses focus.
   * @payload DateRangeBlurEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onBlurChange
   */
  @Output() focusLost: EventEmitter<DateRangeBlurEvent> = new EventEmitter<DateRangeBlurEvent>();

  /**
   * Emits on the inner field keydown event.
   * @payload DateRangeKeydownEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeydownHandle
   */
  @Output() keyPressed: EventEmitter<DateRangeKeydownEvent> = new EventEmitter<DateRangeKeydownEvent>();

  /**
   * Emits on the inner field keyup event.
   * @payload DateRangeKeyupEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyupHandle
   */
  @Output() keyReleased: EventEmitter<DateRangeKeyupEvent> = new EventEmitter<DateRangeKeyupEvent>();

  /**
   * Reserved output retained for API compatibility. No emission site exists in the supplied implementation.
   * @payload DateRangeEnterEvent
   * @renamedFrom onKeyEnterHandle
   */
  @Output() enterPressed: EventEmitter<DateRangeEnterEvent> = new EventEmitter<DateRangeEnterEvent>();

  /**
   * Emits when the date-selection handler runs.
   * @payload DateRangeDateChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onDateChange
   */
  @Output() dateChange: EventEmitter<DateRangeDateChangeEvent> = new EventEmitter<DateRangeDateChangeEvent>();


  /**
 * Returns complete date range field information
 * @returns object containing start date, end date, and field name
 */
  private fieldInfo(): DateRangeFieldInfo {
    return {
      endDate: this.endModelValue,
      fieldName: this.fieldName,
      startDate: this.startModelValue
    };
  }


  /**
 * Handles date change for start or end date
 * @param event Date change event
 * @param dateType Indicates START_DATE or END_DATE
 * @returns void (emits dateChange)
 */
  public handleDateChange(event: any, dateType: DateType): void {
    if (dateType === 'END_DATE' && this.endModelValue) {
      this.dateRangePicker?.close();
    }
    this.dateChange.emit({
      ...this.fieldInfo(),
      dateType: dateType,
      dateChangeEvent: event
    });
  }


  /**
 * Handles ngModel change for start or end date
 * @param event Updated date value
 * @param dateType Indicates START_DATE or END_DATE
 * @returns void (emits modelChange)
 */
  public handleModelChange(event: Date, dateType: DateType): void {
    this.modelChange.emit({
      ...this.fieldInfo(),
      dateType: dateType,
      modelChangeEvent: event
    });
  }


  /**
 * Handles focus event for start or end date input
 * @param event Focus event
 * @param dateType Indicates START_DATE or END_DATE
 * @returns void (emits focusGained)
 */
  public onFocus(event: FocusEvent, dateType: DateType): void {
    this.focusGained.emit({
      ...this.fieldInfo(),
      dateType: dateType,
      onFocusEvent: event
    });
  }


  /**
 * Handles blur event for start or end date input
 * @param event Blur event
 * @param dateType Indicates START_DATE or END_DATE
 * @returns void (emits focusLost)
 */
  public onBlur(event: FocusEvent, dateType: DateType): void {
    this.focusLost.emit({
      ...this.fieldInfo(),
      dateType: dateType,
      blurEvent: event
    });
  }


  /**
 * Handles keyup event for start or end date input
 * @param event Keyboard event
 * @param dateType Indicates START_DATE or END_DATE
 * @returns void (emits keyReleased)
 */
  public onKeyUp(event: KeyboardEvent, dateType: DateType): void {
    this.keyReleased.emit({
      ...this.fieldInfo(),
      dateType: dateType,
      keyUpEvent: event
    });
  }

  /**
 * Handles keydown event for start or end date input
 * @param event Keyboard event
 * @param dateType Indicates START_DATE or END_DATE
 * @returns void (emits keyPressed)
 */
  public onKeyDown(event: KeyboardEvent, dateType: DateType): void {
    this.keyPressed.emit({
      ...this.fieldInfo(),
      dateType: dateType,
      keyDownEvent: event
    });
  }


  /**
 * Handles input event for start or end date input
 * @param event Input event
 * @param dateType Indicates START_DATE or END_DATE
 * @returns void (emits inputChanged)
 */
  public onInput(event: Event, dateType: DateType): void {
    this.inputChanged.emit({
      ...this.fieldInfo(),
      dateType: dateType,
      inputChangeEvent: event
    });
  }

  /**
 * Handles change event for start or end date input
 * @param event Change event
 * @param dateType Indicates START_DATE or END_DATE
 * @returns void (emits changeCommitted)
 */
  public onChangeHandler(event: any, dateType: DateType): void {
    this.changeCommitted.emit({
      ...this.fieldInfo(),
      dateType: dateType,
      changeEvent: event
    });
  }
}
