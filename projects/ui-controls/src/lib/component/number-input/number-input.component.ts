import {
  Component,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  Output,
  Optional,
  Self,
} from '@angular/core';
import { MaterialModule } from '../../material.module';
import { UiUtilitiesModule } from '../../utilities';
import {
  NumberInputModelChangeEvent,
  NumberInputInputEvent,
  NumberInputFocusEvent,
  NumberInputBlurEvent,
  NumberInputKeydownEvent,
  NumberInputKeyupEvent,
  NumberInputKeyEnterEvent,
  NumberInputFieldInfo,
} from './number-input.interface';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'ui-number-input',
  standalone: true,
  imports: [MaterialModule, UiUtilitiesModule],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
})
export class NumberInputComponent extends BaseControlValueAccessor<number> {
  /**
   * Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true.
   * @default false
   * @type boolean
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() preventCopyPasteCut: boolean = false;

  /** HTML id attribute for the input element */
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
   * Tooltip text displayed on hover
   * @default ''
   * @type string
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() tooltip: string = '';

  /**
   * Label text or translation key displayed for this control.
   * @default ''
   * @type string
   */
  @Input() label: string = '';

  /**
   * Direct binding to the component model, backed by its existing value accessor.
   * @type number
   */
  @Input()
  get modelValue(): number {
    return this.value as number;
  }
  set modelValue(val: number) {
    this.value = val;
  }

  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeDetectorRef);
  }

  /**
   * Error message displayed when validation fails
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
   * Defines input behavior: number or percentage
   * @default 'number'
   * @type 'number' | 'percentage' | 'integers'
   */
  @Input() inputType: 'number' | 'percentage' | 'integers' = 'number';

  /**
   * Text alignment inside the input: 'left' | 'right' | 'center' (defaults to 'left')
   * @default 'left'
   * @type 'left' | 'right' | 'center'
   */
  @Input() textAlign: 'left' | 'right' | 'center' = 'left';

  /**
   * Maximum allowed digits
   * @type number
   */
  @Input() maxDigits!: number;

  /**
   * Minimum allowed numeric value
   * @type number
   */
  @Input() minValue!: number;

  /**
   * Maximum allowed numeric value
   * @type number
   */
  @Input() maxValue!: number;

  /**
   * Allows decimal values when true
   * @type boolean
   */
  @Input() allowDecimal!: boolean;

  /**
   * Maximum number of decimal places allowed
   * @type number
   */
  @Input() decimalPlaces!: number;

  /**
   * Allows negative numbers when true
   * @default false
   * @type boolean
   */
  @Input() allowNegative: boolean = false;

  /**
   * Text displayed before the input value (e.g. '$', '+91', 'kg').
   * @default ''
   */
  @Input() prefix = '';

  /**
   * Controls whether the prefix is rendered. Set to `true` only when the prefix should be visible.
   * @type boolean
   */
  @Input()
  set showPrefix(enablePrefix: boolean) {
    this.enablePrefix = enablePrefix;
  }
  public enablePrefix: boolean = false;

  /**
   * Text displayed after the input, such as a unit or percentage sign.
   * @default ''
   * @renamedFrom postfix
   */
  @Input() suffix = '';

  /**
   * Controls whether the suffix is rendered.
   * @type boolean
   * @renamedFrom showPostfix
   */
  @Input()
  set showSuffix(enablePostfix: boolean) {
    this.enablePostfix = enablePostfix;
  }
  public enablePostfix: boolean = false;

  /**
   * Emits when the component model-change handler runs.
   * @payload NumberInputModelChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onModelChange
   */
  @Output() modelChange: EventEmitter<NumberInputModelChangeEvent> =
    new EventEmitter<NumberInputModelChangeEvent>();

  /**
   * Emits from the existing input/change handler.
   * @payload NumberInputInputEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onInputChange
   */
  @Output() inputChanged: EventEmitter<NumberInputInputEvent> =
    new EventEmitter<NumberInputInputEvent>();

  /**
   * Emits when the inner field gains focus.
   * @payload NumberInputFocusEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onFocusChange
   */
  @Output() focusGained: EventEmitter<NumberInputFocusEvent> =
    new EventEmitter<NumberInputFocusEvent>();

  /**
   * Emits when the inner field loses focus.
   * @payload NumberInputBlurEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onBlurChange
   */
  @Output() focusLost: EventEmitter<NumberInputBlurEvent> =
    new EventEmitter<NumberInputBlurEvent>();

  /**
   * Emits on the inner field keydown event.
   * @payload NumberInputKeydownEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeydownHandle
   */
  @Output() keyPressed: EventEmitter<NumberInputKeydownEvent> =
    new EventEmitter<NumberInputKeydownEvent>();

  /**
   * Emits on the inner field keyup event.
   * @payload NumberInputKeyupEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyupHandle
   */
  @Output() keyReleased: EventEmitter<NumberInputKeyupEvent> =
    new EventEmitter<NumberInputKeyupEvent>();

  /**
   * Emits when Enter is released in the inner field.
   * @payload NumberInputKeyEnterEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyEnterHandle
   */
  @Output() enterPressed: EventEmitter<NumberInputKeyEnterEvent> =
    new EventEmitter<NumberInputKeyEnterEvent>();

  /**
   * Returns common field information
   * reused across emitted events.
   */
  private fieldInfo(): NumberInputFieldInfo {
    let inputRef: Element | null = null;
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
   * Emits when the model value changes
   * @param modelChange - Updated model value
   */
  public modelValueChange(modelChange: number): void {
    this.modelChange.emit({
      ...this.fieldInfo(),
      modelChangeEvent: modelChange,
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

  onWheel(event: WheelEvent) {
    event.preventDefault();
  }
}
