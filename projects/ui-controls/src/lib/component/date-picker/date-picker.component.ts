import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  Optional,
  Self,
  ChangeDetectorRef,
} from '@angular/core';
import { AutoPopulateCurrentDateDirective } from '../../directive/auto-populate-current-date.directive';
import { MaterialModule } from '../../material.module';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatMomentDateModule, provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from '../../utilities';
import {
  DatePickerModelChangeEvent,
  DatePickerChangeEvent,
  DatePickerInputEvent,
  DatePickerFocusEvent,
  DatePickerBlurEvent,
  DatePickerKeyDownEvent,
  DatePickerKeyUpEvent,
  DatePickerDateChangeEvent,
  DatePickerEnterEvent,
  DatePickerFieldInfo,
} from './date-picker.interface';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { OverlayContainer } from '@angular/cdk/overlay';
import moment from 'moment';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'ui-date-picker',
  standalone: true,
  imports: [MaterialModule, MatMomentDateModule, AutoPopulateCurrentDateDirective],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [provideMomentDateAdapter(DATE_FORMATS)],
})
export class DatePickerComponent extends BaseControlValueAccessor<Date> {
  // Unique ID for the input element
  protected rawInputId: string = '';

  /**
   * Identifier assigned to the inner control; combined with idPrefix when supplied.
   * @type string
   * @remarks Required Angular input; provide a stable identifier.
   */
  @Input({ required: true })
  set inputId(id: string) {
    this.rawInputId = id || '';
    this.configureId();
  }
  get inputId(): string {
    return this.rawInputId;
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

  /**
   * Direct binding to the component model, backed by its existing value accessor.
   * @type Date
   */
  @Input()
  get modelValue(): Date {
    return this.value as Date;
  }
  set modelValue(val: Date) {
    this.value = val;
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
   * Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved.
   * @type string | number
   * @renamedFrom textFieldName
   */
  @Input() fieldName!: string | number;

  /**
   * Hint text or translation key displayed while the control is empty.
   * @default ''
   * @type string
   */
  @Input() placeholder: string = '';

  /**
   * Requests the existing read-only behavior without disabling the parent form control.
   * @default false
   * @type boolean
   */
  @Input() readonly: boolean = false;

  /**
   * Automatically populate current date on load
   * @default true
   * @type boolean
   */
  @Input() autoPopulateDateTime: boolean = true;

  /**
   * Minimum selectable date
   * @type Date
   */
  @Input() minDate!: Date;

  /**
   * Maximum selectable date
   * @type Date
   */
  @Input() maxDate!: Date;

  /**
   * Flag to control whether today's date should be displayed in the UI
   * @default false
   * @type boolean
   */
  @Input() showTodayDate: boolean = false;

  /**
   * Emits when the component model-change handler runs.
   * @payload DatePickerModelChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onModelChange
   */
  @Output() modelChange: EventEmitter<DatePickerModelChangeEvent> =
    new EventEmitter<DatePickerModelChangeEvent>();

  /**
   * Emits from the existing change handler.
   * @payload DatePickerChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onChange
   */
  @Output() changeCommitted: EventEmitter<DatePickerChangeEvent> =
    new EventEmitter<DatePickerChangeEvent>();

  /**
   * Emits from the existing input/change handler.
   * @payload DatePickerInputEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onInputChange
   */
  @Output() inputChanged: EventEmitter<DatePickerInputEvent> =
    new EventEmitter<DatePickerInputEvent>();

  /**
   * Emits when the inner field gains focus.
   * @payload DatePickerFocusEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onFocusChange
   */
  @Output() focusGained: EventEmitter<DatePickerFocusEvent> =
    new EventEmitter<DatePickerFocusEvent>();

  /**
   * Emits when the inner field loses focus.
   * @payload DatePickerBlurEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onBlurChange
   */
  @Output() focusLost: EventEmitter<DatePickerBlurEvent> = new EventEmitter<DatePickerBlurEvent>();

  /**
   * Emits on the inner field keydown event.
   * @payload DatePickerKeyDownEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeydownHandle
   */
  @Output() keyPressed: EventEmitter<DatePickerKeyDownEvent> =
    new EventEmitter<DatePickerKeyDownEvent>();

  /**
   * Emits on the inner field keyup event.
   * @payload DatePickerKeyUpEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyupHandle
   */
  @Output() keyReleased: EventEmitter<DatePickerKeyUpEvent> =
    new EventEmitter<DatePickerKeyUpEvent>();

  /**
   * Reserved output retained for API compatibility. No emission site exists in the supplied implementation.
   * @payload DatePickerEnterEvent
   * @renamedFrom onKeyEnterHandle
   */
  @Output() enterPressed: EventEmitter<DatePickerEnterEvent> =
    new EventEmitter<DatePickerEnterEvent>();

  /**
   * Emits when the date-selection handler runs.
   * @payload DatePickerDateChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onDateChange
   */
  @Output() dateChange: EventEmitter<DatePickerDateChangeEvent> =
    new EventEmitter<DatePickerDateChangeEvent>();

  /**  ViewChild reference to the custom footer DOM element.
   *  This element is appended manually to the mat-calendar rendered inside
   * the Angular Material datepicker overlay.
   */
  @ViewChild('datePickerFooter', { static: false }) datePickerFooter: ElementRef;

  /**ViewChild reference to the MatDatepicker component.
   *  Used to detect when the datepicker opens so overlay DOM manipulation
   *  can be safely performed.
   */
  @ViewChild('datePicker', { static: false }) datePicker: MatDatepicker<any>;

  // Stores today's date formatted as DD-MMM-YYYY (e.g., 29-Jan-2026)
  public todayDate: string = '';

  /** Angular Material OverlayContainer.
   * Used to access the DOM of components rendered in CDK overlays (e.g. mat-datepicker),
   *  since these elements are not part of the component template.
   */
  constructor(
    private overlayContainer: OverlayContainer,
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeDetectorRef);
  }

  ngOnInit(): void {
    this.todayDate = `Today ( ${moment(new Date()).format('DD-MMM-YYYY')})`;
  }

  /**
   * Returns field metadata along with current value
   * @returns object containing model value and field name
   */
  private fieldInfo(): DatePickerFieldInfo {
    let inputRef: HTMLElement | null = null;
    if (this.effectiveId) {
      inputRef = typeof document === 'undefined' ? null : document.getElementById(this.effectiveId);
    }
    return {
      ...(inputRef && { inputRef: inputRef }),
      modelValue: this.modelValue,
      textFieldName: this.fieldName,
    };
  }

  /**
   * Handles date picker change event
   * @param onDateChangeEvent Date change event
   * @returns void (emits dateChange)
   */
  public handleDateChange(onDateChangeEvent: MatDatepickerInputEvent<Date>): void {
    this.dateChange.emit({
      ...this.fieldInfo(),
      dateChangeEvent: onDateChangeEvent,
    });
  }

  /**
   * Handles ngModel change event
   * @param handleModelChange Updated model value
   * @returns void (emits modelChange)
   */
  public handleModelChange(modelChange: Date | null): void {
    this.modelChange.emit({
      ...this.fieldInfo(),
      modelChangeEvent: modelChange,
    });
  }

  /**
   * Handles focus event
   * @param onFocus Focus event
   * @returns void (emits focusGained)
   */
  public onFocus(onFocus: FocusEvent): void {
    this.focusGained.emit({
      ...this.fieldInfo(),
      onFocusEvent: onFocus,
    });
  }

  /**
   * Handles blur event
   * @param onBlur Blur event
   * @returns void (emits focusLost)
   */
  public onBlur(onBlur: FocusEvent): void {
    this.focusLost.emit({
      ...this.fieldInfo(),
      onBlurEvent: onBlur,
    });
  }

  /**
   * Handles keyup event
   * @param onkeyUp Keyboard event
   * @returns void (emits keyReleased)
   */
  public onKeyUp(onkeyUp: KeyboardEvent): void {
    this.keyReleased.emit({
      ...this.fieldInfo(),
      onKeyUpEvent: onkeyUp,
    });
  }

  /**
   * Handles keydown event
   * @param onkeyDown Keyboard event
   * @returns void (emits keyPressed)
   */
  public onKeyDown(onkeyDown: KeyboardEvent): void {
    this.keyPressed.emit({
      ...this.fieldInfo(),
      onkeyDownEvent: onkeyDown,
    });
  }

  /**
   * Handles keydown event
   * @param onkeyDown Keyboard event
   * @returns void (emits keyPressed)
   */
  public onInput(event: Event): void {
    this.inputChanged.emit({
      ...this.fieldInfo(),
      changeEvent: event,
    });
  }

  /**
   * Handles change event
   * @param event Change event
   * @returns void (emits changeCommitted)
   */
  public onChangeHandler(event: any): void {
    this.changeCommitted.emit({
      ...this.fieldInfo(),
      onChangeEvent: event,
    });
  }
  /** Retained for compatibility; Material owns overlay rendering. */
  calendarOpen(): void {}
  todayDateSelection(): void {
    if (this.disabled || this.readonly) return;
    const today = moment();
    if (
      (this.minDate && today.isBefore(this.minDate, 'day')) ||
      (this.maxDate && today.isAfter(this.maxDate, 'day'))
    )
      return;
    this.modelValue = today as any;
    this.commitValue();
    this.handleModelChange(this.modelValue);
    this.datePicker.close();
  }
}
