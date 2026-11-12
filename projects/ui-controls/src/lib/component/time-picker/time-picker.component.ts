import {
  Component,
  EventEmitter,
  Input,
  Output,
  Optional,
  Self,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
  TimePickerDateChangeEvent,
  TimePickerFieldInfo,
  TimePickerChangeEvent,
  TimePickerFocusEvent,
  TimePickerKeyboardEvent,
  TimePickerChange,
} from './time-picker.interface';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'ui-time-picker',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss',
})
export class TimePickerComponent extends BaseControlValueAccessor<string> {
  @ViewChild('timeInput', { static: false }) timeInput?: ElementRef<HTMLInputElement>;
  /** Unique input identifier */
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
   * Opens the browser native time picker popup window
   */
  public openTimePicker(): void {
    if (this.disabled || this.readonly) {
      return;
    }
    const input =
      this.timeInput?.nativeElement ||
      (this.effectiveId
        ? (document.getElementById(this.effectiveId) as HTMLInputElement)
        : null);
    if (input && typeof (input as any).showPicker === 'function') {
      try {
        (input as any).showPicker();
      } catch {
        // Fallback if browser restricts showPicker
      }
    }
  }

  /**
   * Label text or translation key displayed for this control.
   * @default ''
   * @type string
   */
  @Input() label: string = '';

  /**
   * Direct binding to the component model, backed by its existing value accessor.
   * @type string
   */
  @Input()
  get modelValue(): string {
    return this.value || '';
  }
  set modelValue(val: string) {
    this.value = val;
  }

  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(ngControl, changeDetectorRef);
  }

  /**
   * Validation error message
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
   * Minimum selectable time
   * @type string
   */
  @Input() minTime!: string;

  /**
   * Maximum selectable time
   * @type string
   */
  @Input() maxTime!: string;

  /**
   * Emits when the component model-change handler runs.
   * @payload TimePickerFieldInfo
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onModelChange
   */
  @Output() modelChange: EventEmitter<TimePickerFieldInfo> =
    new EventEmitter<TimePickerFieldInfo>();

  /**
   * Emits from the existing change handler.
   * @payload TimePickerChange
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onChange
   */
  @Output() changeCommitted: EventEmitter<TimePickerChange> =
    new EventEmitter<TimePickerChange>();

  /**
   * Emits from the existing input/change handler.
   * @payload TimePickerChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onInputChange
   */
  @Output() inputChanged: EventEmitter<TimePickerChangeEvent> =
    new EventEmitter<TimePickerChangeEvent>();

  /**
   * Emits when the inner field gains focus.
   * @payload TimePickerFocusEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onFocusChange
   */
  @Output() focusGained: EventEmitter<TimePickerFocusEvent> =
    new EventEmitter<TimePickerFocusEvent>();

  /**
   * Emits when the inner field loses focus.
   * @payload TimePickerFocusEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onBlurChange
   */
  @Output() focusLost: EventEmitter<TimePickerFocusEvent> =
    new EventEmitter<TimePickerFocusEvent>();

  /**
   * Emits on the inner field keydown event.
   * @payload TimePickerKeyboardEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeydownHandle
   */
  @Output() keyPressed: EventEmitter<TimePickerKeyboardEvent> =
    new EventEmitter<TimePickerKeyboardEvent>();

  /**
   * Emits on the inner field keyup event.
   * @payload TimePickerKeyboardEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyupHandle
   */
  @Output() keyReleased: EventEmitter<TimePickerKeyboardEvent> =
    new EventEmitter<TimePickerKeyboardEvent>();

  /**
   * Reserved output retained for API compatibility. No emission site exists in the supplied implementation.
   * @payload TimePickerKeyboardEvent
   * @renamedFrom onKeyEnterHandle
   */
  @Output() enterPressed: EventEmitter<TimePickerKeyboardEvent> =
    new EventEmitter<TimePickerKeyboardEvent>();

  /**
   * Returns time picker field information
   *
   * @returns object containing model value and field name
   */
  private fieldInfo(): TimePickerFieldInfo {
    let inputRef: HTMLElement | null = null;
    if (this.effectiveId) {
      inputRef = document.querySelector(`#${this.effectiveId}`);
    }
    return {
      ...(inputRef && { inputRef: inputRef }),
      modelValue: this.modelValue,
      textFieldName: this.fieldName,
    };
  }

  /**
   * Handles ngModel value change
   *
   * @param event Updated time value
   * @returns void (emits modelChange)
   */
  public handleModelChange(event: any): void {
    this.modelChange.emit({
      ...this.fieldInfo(),
      ...{ changeEvent: event },
    });
  }

  /**
   * Handles focus event
   *
   * @returns void (emits focusGained)
   */
  public onFocus(): void {
    this.focusGained.emit(this.fieldInfo());
  }
  /**
   * Handles blur event
   *
   * @returns void (emits focusLost)
   */
  public onBlur(): void {
    this.focusLost.emit(this.fieldInfo());
  }
  /**
   * Handles keyup event
   *
   * @param event Keyboard event
   * @returns void (emits keyReleased)
   */
  public onKeyUp(event: KeyboardEvent): void {
    this.keyReleased.emit({
      ...this.fieldInfo(),
      ...{ changeEvent: event },
    });
  }
  /**
   * Handles keydown event
   *
   * @param event Keyboard event
   * @returns void (emits keyPressed)
   */
  public onKeyDown(event: KeyboardEvent): void {
    this.keyPressed.emit({
      ...this.fieldInfo(),
      ...{ changeEvent: event },
    });
  }
  /**
   * Handles input event
   *
   * @param event Input event
   * @returns void (emits inputChanged)
   */
  public onInput(event: Event): void {
    this.inputChanged.emit({
      ...this.fieldInfo(),
      ...{ changeEvent: event },
    });
  }
  /**
   * Handles change event
   *
   * @param event Change event
   * @returns void (emits changeCommitted)
   */
  public onChangeHandler(event: any): void {
    this.changeCommitted.emit({
      ...this.fieldInfo(),
      ...{ changeEvent: event },
    });
  }
}
