import { Component, EventEmitter, Input, Output, Optional, Self, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { AutoPopulateCurrentDateDirective } from '../../directive/auto-populate-current-date.directive';
import { MaterialModule } from '../../material.module';
import {
  NgxMatDatepickerActions, NgxMatDatepickerApply,
  NgxMatDatepickerInput, NgxMatDatetimepicker,
  NgxMatDatepickerToggle,
  NgxMatDatepickerInputEvent
} from '@ngxmc/datetime-picker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DATE_TIME_FORMATS } from '../../utilities';
import moment from 'moment';
import {
  DateTimePickerBlurEvent,
  DateTimePickerChangeEvent,
  DateTimePickerDateChangeEvent,
  DateTimePickerFieldInfo,
  DateTimePickerFocusEvent,
  DateTimePickerInputEvent,
  DateTimePickerKeydownEvent,
  DateTimePickerKeyEnter,
  DateTimePickerKeyupEvent,
  DateTimePickerModelChangeEvent
} from './date-time-picker.interface';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'ui-date-time-picker',
  standalone: true,
  imports: [
    MaterialModule,
    MatMomentDateModule,
    NgxMatDatetimepicker,
    NgxMatDatepickerApply,
    NgxMatDatepickerInput,
    NgxMatDatepickerToggle,
    NgxMatDatepickerActions,
    AutoPopulateCurrentDateDirective
  ],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_TIME_FORMATS }],
  templateUrl: './date-time-picker.component.html',
  styleUrl: './date-time-picker.component.scss'
})
export class DateTimePickerComponent extends BaseControlValueAccessor<Date> implements AfterViewInit {
  @ViewChild('pickerWithActions') pickerWithActions!: NgxMatDatetimepicker<any>;

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

  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(ngControl, changeDetectorRef);
  }

  ngAfterViewInit(): void {
    this.pickerWithActions?.openedStream.subscribe(() => {
      const instance = (this.pickerWithActions as any)?._componentRef?.instance;
      instance?._model?.selectionChanged.subscribe(() => {
        this.changeDetectorRef.detectChanges();
      });
    });
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
   * Automatically populate current date-time
   * @default true
   * @type boolean
   */
  @Input() autoPopulateDateTime: boolean = true;

  /**
   * Minimum selectable date-time
   * @type Date
   */
  @Input() minDate!: Date;

  /**
   * Maximum selectable date-time
   * @type Date
   */
  @Input() maxDate!: Date;

  /** Checks if selected date and time violates min/max bounds to disable apply tick */
  public isApplyDisabled(picker: any): boolean {
    const selectedDate = picker?._componentRef?.instance?._model?.selection;
    if (!selectedDate) return false;

    if (this.minDate && new Date(selectedDate) < new Date(this.minDate)) return true;
    if (this.maxDate && new Date(selectedDate) > new Date(this.maxDate)) return true;

    return false;
  }

  /**
   * Emits when the date-selection handler runs.
   * @payload DateTimePickerDateChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onDateChange
   */
  @Output() dateChange: EventEmitter<DateTimePickerDateChangeEvent> = new EventEmitter<DateTimePickerDateChangeEvent>();

  /**
   * Emits when the component model-change handler runs.
   * @payload DateTimePickerModelChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onModelChange
   */
  @Output() modelChange: EventEmitter<DateTimePickerModelChangeEvent> = new EventEmitter<DateTimePickerModelChangeEvent>();

  /**
   * Emits from the existing change handler.
   * @payload DateTimePickerChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onChange
   */
  @Output() changeCommitted: EventEmitter<DateTimePickerChangeEvent> = new EventEmitter<DateTimePickerChangeEvent>();

  /**
   * Emits from the existing input/change handler.
   * @payload DateTimePickerInputEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onInputChange
   */
  @Output() inputChanged: EventEmitter<DateTimePickerInputEvent> = new EventEmitter<DateTimePickerInputEvent>();

  /**
   * Emits when the inner field gains focus.
   * @payload DateTimePickerFocusEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onFocusChange
   */
  @Output() focusGained: EventEmitter<DateTimePickerFocusEvent> = new EventEmitter<DateTimePickerFocusEvent>();

  /**
   * Emits when the inner field loses focus.
   * @payload DateTimePickerBlurEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onBlurChange
   */
  @Output() focusLost: EventEmitter<DateTimePickerBlurEvent> = new EventEmitter<DateTimePickerBlurEvent>();

  /**
   * Emits on the inner field keydown event.
   * @payload DateTimePickerKeydownEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeydownHandle
   */
  @Output() keyPressed: EventEmitter<DateTimePickerKeydownEvent> = new EventEmitter<DateTimePickerKeydownEvent>();

  /**
   * Emits on the inner field keyup event.
   * @payload DateTimePickerKeyupEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyupHandle
   */
  @Output() keyReleased: EventEmitter<DateTimePickerKeyupEvent> = new EventEmitter<DateTimePickerKeyupEvent>();

  /**
   * Reserved output retained for API compatibility. No emission site exists in the supplied implementation.
   * @payload DateTimePickerKeyEnter
   * @renamedFrom onKeyEnterHandle
   */
  @Output() enterPressed: EventEmitter<DateTimePickerKeyEnter> = new EventEmitter<DateTimePickerKeyEnter>();

  /**
 * Returns field metadata along with current date-time value
 * @returns object containing model value and field name
 */
  private fieldInfo(): DateTimePickerFieldInfo {
    let inputRef: Element | null = null;
    if (this.effectiveId) {
      inputRef = document.querySelector(`#${this.effectiveId}`);
    }
    return {
      ...inputRef && { inputRef: inputRef },
      modelValue: this.modelValue,
      textFieldName: this.fieldName
    };
  }


  /**
 * Handles date-time picker change event
 * @param handleDateChange Date change event
 * @returns void (emits dateChange)
 */

  public handleDateChange(dateChange: NgxMatDatepickerInputEvent<any, any>): void {
    this.dateChange.emit({
      ...this.fieldInfo(),
      dateChangeEvent: dateChange
    });
  }


  /**
 * Handles ngModel value change
 * @param modelValueChange Updated model value
 * @returns void (emits modelChange)
 */
  public handleModelChange(modelValueChange: Date): void {
    this.modelChange.emit({
      ...this.fieldInfo(),
      modelChangeEvent: modelValueChange
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
      focusEvent: onFocus
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
      blurEvent: onBlur
    });
  }


  /**
 * Handles keyup event
 * @param onKeyUp Keyboard event
 * @returns void (emits keyReleased)
 */
  public onKeyUp(onKeyUp: KeyboardEvent): void {
    this.keyReleased.emit({
      ...this.fieldInfo(),
      keyUpEvent: onKeyUp
    });
  }


  /**
 * Handles keydown event
 * @param onKeyDown Keyboard event
 * @returns void (emits keyPressed)
 */
  public onKeyDown(onKeyDown: KeyboardEvent): void {
    this.keyPressed.emit({
      ...this.fieldInfo(),
      keyDownEvent: onKeyDown
    });
  }


  /**
 * Handles input event
 * @param inputChanged Input event
 * @returns void (emits inputChanged)
 */
  public onInput(onInputChange: Event): void {
    this.inputChanged.emit({
      ...this.fieldInfo(),
      inputChangeEvent: onInputChange
    });
  }


  /**
 * Handles change event
 * @param changeEvent Change event
 * @returns void (emits changeCommitted)
 */
  public onChangeHandler(changeEvent: Event): void {
    this.changeCommitted.emit({
      ...this.fieldInfo(),
      changeEvent: changeEvent
    });
  }

  /**
   * When the picker dialog is opened and no date-time is currently selected,
   * pre-selects the current date on the calendar and sets the current time
   * in the timepicker spinners without populating the input text-box.
   */
  public onPickerOpened(): void {
    const hasValue = this.modelValue && moment(this.modelValue).isValid();
    if (!hasValue) {
      const content = (this.pickerWithActions as any)?._componentRef?.instance;
      if (content && content._model && !content._model.selection) {
        const now = moment();
        content._model.add(now);
        content._modelTime = now;
        content._changeDetectorRef?.markForCheck();
        content._changeDetectorRef?.detectChanges();
        setTimeout(() => {
          content._changeDetectorRef?.markForCheck();
          content._changeDetectorRef?.detectChanges();
        }, 0);
      }
    }
  }
}
