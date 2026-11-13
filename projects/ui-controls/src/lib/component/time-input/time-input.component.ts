import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  Optional,
  Self,
  ChangeDetectorRef,
} from '@angular/core';
import { MaterialModule } from '../../material.module';
import { UiUtilitiesModule } from '../../utilities';
import { NgControl } from '@angular/forms';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';

@Component({
  selector: 'ui-time-input',
  standalone: true,
  imports: [MaterialModule, UiUtilitiesModule],
  templateUrl: './time-input.component.html',
  styleUrl: './time-input.component.scss',
})
export class TimeInputComponent extends BaseControlValueAccessor<string> {
  /**
   * Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true.
   * @default false
   * @type boolean
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() preventCopyPasteCut: boolean = false;

  /** HTML id attribute for the input hr element */
  protected rawInputIdHr: string = '';
  protected rawInputIdMin: string = '';

  public effectiveIdHr: string = '';
  public effectiveIdMin: string = '';

  /**
   * Identifier for the hours input, combined with idPrefix when supplied.
   * @type string
   * @remarks Required Angular input; provide a stable identifier.
   * @renamedFrom inputIdHr
   */
  @Input({ required: true })
  set hoursInputId(id: string) {
    this.rawInputIdHr = id || '';
    this.configureTimeIds();
  }
  get hoursInputId(): string {
    return this.rawInputIdHr;
  }

  /**
   * Identifier for the minutes input, combined with idPrefix when supplied.
   * @type string
   * @remarks Required Angular input; provide a stable identifier.
   * @renamedFrom inputIdMin
   */
  @Input({ required: true })
  set minutesInputId(id: string) {
    this.rawInputIdMin = id || '';
    this.configureTimeIds();
  }
  get minutesInputId(): string {
    return this.rawInputIdMin;
  }

  public override configureId(): void {
    this.configureTimeIds();
  }

  private configureTimeIds(): void {
    this.effectiveIdHr =
      this.rawIdPrefix && this.rawInputIdHr
        ? `${this.rawIdPrefix}_${this.rawInputIdHr}`
        : this.rawInputIdHr;
    this.effectiveIdMin =
      this.rawIdPrefix && this.rawInputIdMin
        ? `${this.rawIdPrefix}_${this.rawInputIdMin}`
        : this.rawInputIdMin;
  }

  /**
   * Validation error message
   * @default ''
   * @type string
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
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
   * Requests the existing read-only behavior without disabling the parent form control.
   * @default false
   * @type boolean
   */
  @Input() readonly: boolean = false;

  public hours = '';
  public minutes = '';

  /**
   * Direct binding to the component model, backed by its existing value accessor.
   * @type string
   */
  @Input()
  get modelValue(): string {
    return this.value || '';
  }
  set modelValue(savedTime: string) {
    this.value = savedTime;
    if (savedTime) {
      const [hrs, mints] = savedTime.split(':');
      this.hours = hrs;
      this.minutes = mints;
    } else {
      this.hours = '';
      this.minutes = '';
    }
  }

  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeDetectorRef);
  }

  override writeValue(savedTime: string | null): void {
    super.writeValue(savedTime);
    if (savedTime) {
      const [hrs, mints] = savedTime.split(':');
      this.hours = hrs;
      this.minutes = mints;
    } else {
      this.hours = '';
      this.minutes = '';
    }
  }

  /**
   * Emits when the component model-change handler runs.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onModelChange
   */
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits from the existing input/change handler.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onInputChange
   */
  @Output() inputChanged: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits when the inner field gains focus.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onFocusChange
   */
  @Output() focusGained: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits when the inner field loses focus.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onBlurChange
   */
  @Output() focusLost: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits on the inner field keydown event.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeydownHandle
   */
  @Output() keyPressed: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits on the inner field keyup event.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyupHandle
   */
  @Output() keyReleased: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emits when Enter is released in the inner field.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyEnterHandle
   */
  @Output() enterPressed: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Returns common field information
   * reused across emitted events.
   */
  private fieldInfo(): any {
    return {
      modelValue: this.formatTimeValue(),
      textFieldName: this.fieldName,
    };
  }

  /**
   * Emits when the model value changes
   * @param modelChange - Updated model value
   */
  public modelValueChange(modelChange: any): void {
    const timeVal = this.formatTimeValue();
    this.value = timeVal;
    this.commitValue(timeVal);
    this.modelChange.emit({
      ...this.fieldInfo(),
      modelChangeEvent: timeVal,
    });
  }

  /**
   * Emits when the input value changes
   * @param changeValue - Input change event
   */
  public inputChange(changeValue: Event): void {
    this.inputChanged.emit({
      ...this.fieldInfo(),
      changeEvent: changeValue,
    });
  }

  /**
   * Emits when input gains focus
   * @param onFocus - Focus event
   */
  public focusChange(onFocus: FocusEvent): void {
    this.focusGained.emit({
      ...this.fieldInfo(),
      focusEvent: onFocus,
    });
  }

  /**
   * Emits when input loses focus
   * @param blurEvent - Blur event
   */

  public blurChange(blurEvent: FocusEvent): void {
    this.focusLost.emit({
      ...this.fieldInfo(),
      blurEvent: blurEvent,
    });
  }

  /**
   * Emits on keydown action
   * @param event - Keyboard event
   */
  public keydownHandle(event: KeyboardEvent): void {
    this.keyPressed.emit({
      ...this.fieldInfo(),
      keyDownEvent: event,
    });
  }

  /**
   * Emits on keyup action
   * @param event - Keyboard event
   */
  public keyupHandle(event: KeyboardEvent): void {
    this.keyReleased.emit({
      ...this.fieldInfo(),
      keyUpEvent: event,
    });
  }

  /**
   * Emits when Enter key is pressed
   * @param event - Keyboard or input event
   */
  public keyEnterHandle(event: Event): void {
    this.enterPressed.emit({
      ...this.fieldInfo(),
      keyEnterEvent: event,
    });
  }

  private formatTimeValue(): string | null {
    if (this.hours === '' && this.minutes === '') return null;
    const hours = Number(this.hours || 0);
    const minutes = Number(this.minutes || 0);
    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    )
      return null;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  public onKeyUp(event: KeyboardEvent, restrictNumber: number, modalValue: string) {
    if (!['Backspace', 'Delete'].includes(event.key)) {
      const inputElement = event.target as HTMLInputElement;
      if (Number(inputElement.value) > restrictNumber) {
        inputElement.value = this[modalValue] = restrictNumber.toString();
      }
    }
  }

  public setZeroBefore() {
    this.hours = this.hours ? this.hours.toString().padStart(2, '0') : '';
    this.minutes = this.minutes ? this.minutes.toString().padStart(2, '0') : '';
    this.value = this.formatTimeValue();
  }
  public acceptNumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
