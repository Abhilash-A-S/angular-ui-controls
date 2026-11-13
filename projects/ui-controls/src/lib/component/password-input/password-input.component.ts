import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  Output,
  Optional,
  Self,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import {
  PasswordInputModelChangeEvent,
  PasswordInputInputEvent,
  PasswordInputFocusEvent,
  PasswordInputBlurEvent,
  PasswordInputKeydownEvent,
  PasswordInputKeyupEvent,
  PasswordInputKeyEnterEvent,
  PasswordInputFieldInfo,
} from './password-input.interface';
import { UiUtilitiesModule } from '../../utilities';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'ui-password-input',
  standalone: true,
  imports: [CommonModule, MaterialModule, UiUtilitiesModule],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputComponent extends BaseControlValueAccessor<string> {
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
   * Label text or translation key displayed for this control.
   * @default ''
   * @type string
   */
  @Input() label: string = '';

  /**
   * Direct binding to the component model, backed by its existing value accessor.
   */
  @Input()
  get modelValue(): any {
    return this.value;
  }
  set modelValue(val: any) {
    this.value = val;
  }

  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeDetectorRef);
  }

  /**
   * Error message shown when validation fails
   * @default ''
   * @type string
   */
  @Input() errorMessage: string = '';

  /**
   * Marks this control as required in its existing template; parent-form validators remain separately configured.
   * @default false
   */
  @Input() required = false;

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
   * Passes the Arabic typing flag to the existing utility directive.
   * @default false
   * @type boolean
   * @renamedFrom appToArabic
   */
  @Input() enableArabicInput: boolean = false;

  /** Toggles visibility of the password */
  public showPassword: boolean = false;

  /**
   * Emits when the component model-change handler runs.
   * @payload PasswordInputModelChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onModelChange
   */
  @Output() modelChange: EventEmitter<PasswordInputModelChangeEvent> =
    new EventEmitter<PasswordInputModelChangeEvent>();

  /**
   * Emits from the existing input/change handler.
   * @payload PasswordInputInputEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onInputChange
   */
  @Output() inputChanged: EventEmitter<PasswordInputInputEvent> =
    new EventEmitter<PasswordInputInputEvent>();

  /**
   * Emits when the inner field gains focus.
   * @payload PasswordInputFocusEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onFocusChange
   */
  @Output() focusGained: EventEmitter<PasswordInputFocusEvent> =
    new EventEmitter<PasswordInputFocusEvent>();

  /**
   * Emits when the inner field loses focus.
   * @payload PasswordInputBlurEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onBlurChange
   */
  @Output() focusLost: EventEmitter<PasswordInputBlurEvent> =
    new EventEmitter<PasswordInputBlurEvent>();

  /**
   * Emits on the inner field keydown event.
   * @payload PasswordInputKeydownEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeydownHandle
   */
  @Output() keyPressed: EventEmitter<PasswordInputKeydownEvent> =
    new EventEmitter<PasswordInputKeydownEvent>();

  /**
   * Emits on the inner field keyup event.
   * @payload PasswordInputKeyupEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyupHandle
   */
  @Output() keyReleased: EventEmitter<PasswordInputKeyupEvent> =
    new EventEmitter<PasswordInputKeyupEvent>();

  /**
   * Emits when Enter is released in the inner field.
   * @payload PasswordInputKeyEnterEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyEnterHandle
   */
  @Output() enterPressed: EventEmitter<PasswordInputKeyEnterEvent> =
    new EventEmitter<PasswordInputKeyEnterEvent>();

  /**
   * Returns shared field information
   * attached to all emitted events.
   */
  private fieldInfo(): PasswordInputFieldInfo {
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
   * Emits when the password model value changes
   * @param modelValueChange - Updated model value
   */
  public modelValueChange(modelValueChange: string): void {
    this.modelChange.emit({
      ...this.fieldInfo(),
      modelChangeEvent: modelValueChange,
    });
  }

  /**
   * Emits on input change event
   * @param changeValue - Input event
   */
  public inputChange(changeValue: Event): void {
    this.inputChanged.emit({
      ...this.fieldInfo(),
      inputChangeEvent: changeValue,
    });
  }

  /**
   * Emits when input gains focus
   * @param onFocusEvent - Focus event
   */

  public focusChange(onFocusEvent: FocusEvent): void {
    this.focusGained.emit({
      ...this.fieldInfo(),
      focusEvent: onFocusEvent,
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
   * Emits on keydown event
   * @param event - Keyboard event
   */
  public keydownHandle(event: KeyboardEvent): void {
    this.keyPressed.emit({
      ...this.fieldInfo(),
      keyDownEvent: event,
    });
  }

  /**
   * Emits on keyup event
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
}
