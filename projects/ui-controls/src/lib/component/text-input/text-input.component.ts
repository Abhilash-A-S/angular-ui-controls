import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  Optional,
  Self,
  ChangeDetectorRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import { MaterialModule } from '../../material.module';
import {
  TextInputBlurEvent,
  TextInputClickEvent,
  TextInputFieldInfo,
  TextInputFocusEvent,
  TextInputInputEvent,
  TextInputKeydownEvent,
  TextInputKeyEnterEvent,
  TextInputKeyupEvent,
  TextInputModelChangeEvent,
} from './text-input.interface';
import { UiUtilitiesModule } from '../../utilities';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ui-text-input',
  standalone: true,
  imports: [MaterialModule, UiUtilitiesModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
})
export class TextInputComponent extends BaseControlValueAccessor<string> {
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
   * Legacy character-limit input bound to maxlength (not a word counter). Retained separately from maxLength; existing precedence is unchanged.
   * @default 0
   * @type number
   */
  @Input() wordsLimit: number = 0;

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
   * Maximum number of characters allowed
   * @type number
   */
  @Input() maxLength!: number;

  /**
   * Shows the current input value in the tooltip when enabled.
   * @default false
   * @type boolean
   * @renamedFrom showToolTip
   */
  @Input() showTooltip: boolean = false;

  /**
   * Value written to the existing ChatGptAttr DOM attribute for field discovery.
   * @default ''
   * @type string
   * @renamedFrom chatGptAttr
   */
  @Input() assistantFieldId: string = '';

  /**
   * Prevents numbers and special special character
   * @default false
   * @type boolean
   */
  @Input() onlyAlphabets: boolean = false;

  /**
   * Passes the Arabic typing flag to the existing utility directive.
   * @default false
   * @type boolean
   * @renamedFrom appToArabic
   */
  @Input() enableArabicInput: boolean = false;

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
   * @payload TextInputModelChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onModelChange
   */
  @Output() modelChange: EventEmitter<TextInputModelChangeEvent> =
    new EventEmitter<TextInputModelChangeEvent>();

  /**
   * Emits from the existing input/change handler.
   * @payload TextInputInputEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onInputChange
   */
  @Output() inputChanged: EventEmitter<TextInputInputEvent> =
    new EventEmitter<TextInputInputEvent>();

  /**
   * Emits when the inner field gains focus.
   * @payload TextInputFocusEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onFocusChange
   */
  @Output() focusGained: EventEmitter<TextInputFocusEvent> =
    new EventEmitter<TextInputFocusEvent>();

  /**
   * Emits when the inner field loses focus.
   * @payload TextInputBlurEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onBlurChange
   */
  @Output() focusLost: EventEmitter<TextInputBlurEvent> = new EventEmitter<TextInputBlurEvent>();

  /**
   * Emits on the inner field keydown event.
   * @payload TextInputKeydownEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeydownHandle
   */
  @Output() keyPressed: EventEmitter<TextInputKeydownEvent> =
    new EventEmitter<TextInputKeydownEvent>();

  /**
   * Emits on the inner field keyup event.
   * @payload TextInputKeyupEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyupHandle
   */
  @Output() keyReleased: EventEmitter<TextInputKeyupEvent> =
    new EventEmitter<TextInputKeyupEvent>();

  /**
   * Emits when Enter is released in the inner field.
   * @payload TextInputKeyEnterEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyEnterHandle
   */
  @Output() enterPressed: EventEmitter<TextInputKeyEnterEvent> =
    new EventEmitter<TextInputKeyEnterEvent>();

  /**
   * Emits when the inner input is clicked.
   * @payload TextInputClickEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onInputClickHandle
   */
  @Output() inputClicked: EventEmitter<TextInputClickEvent> =
    new EventEmitter<TextInputClickEvent>();

  /**
   * Returns shared field information attached
   * to all emitted events.
   *
   * Includes:
   * - Input DOM reference (if inputId is provided)
   * - Current model value
   * - Field identifier
   */
  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeDetectorRef);
  }
  private fieldInfo(): TextInputFieldInfo {
    let inputRef: Element | null = null;
    if (this.effectiveId) {
      inputRef = typeof document === 'undefined' ? null : document.getElementById(this.effectiveId);
    }
    return {
      ...(inputRef && { inputRef: inputRef }),
      modelValue: this.modelValue,
      fieldName: this.fieldName,
    };
  }

  /**
   * Emits when the model value changes
   * @param modelChangeEvent - Updated model value
   */
  public modelValueChange(modelChangeEvent: string): void {
    this.modelChange.emit({
      ...this.fieldInfo(),
      modelChangeEvent: modelChangeEvent,
    });
  }

  /**
   * Emits on input value change
   * @param changeValue - Input event
   */
  public inputChange(changeValue: Event): void {
    this.inputChanged.emit({
      ...this.fieldInfo(),
      changeEvent: changeValue,
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
   * Emits on keydown action
   * @param keyDownEvent - Keyboard event
   */
  public keydownHandle(keyDownEvent: KeyboardEvent): void {
    this.keyPressed.emit({
      ...this.fieldInfo(),
      keyDownEvent: keyDownEvent,
    });
  }

  /**
   * Emits on keyup action
   * @param keyUpEvent - Keyboard event
   */
  public keyupHandle(keyUpEvent: KeyboardEvent): void {
    this.keyReleased.emit({
      ...this.fieldInfo(),
      keyUpEvent: keyUpEvent,
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

  /**
   * Emits when input field is clicked
   * @param clickEvent - Mouse click event
   */
  public inputClick(clickEvent: MouseEvent): void {
    this.inputClicked.emit({
      ...this.fieldInfo(),
      clickEvent: clickEvent,
    });
  }
}
