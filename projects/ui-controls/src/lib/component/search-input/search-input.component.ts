import {
  Component,
  EventEmitter,
  Input,
  Output,
  Optional,
  Self,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { NgControl } from '@angular/forms';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import {
  SearchInputBlurEvent,
  SearchInputClickEvent,
  SearchInputFocusEvent,
  SearchInputInfo,
  SearchInputInputEvent,
  SearchInputKeydownEvent,
  SearchInputKeyEnterEvent,
  SearchInputKeyupEvent,
  SearchInputModelChangeEvent,
} from './search-input.interface';
import { UiUtilitiesModule } from '../../utilities';

@Component({
  selector: 'ui-search-input',
  standalone: true,
  imports: [CommonModule, MaterialModule, UiUtilitiesModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent extends BaseControlValueAccessor<any> {
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
   * Disables the search text input independently of the search button.
   * @default false
   * @type boolean
   * @renamedFrom disableSearch
   */
  @Input() searchDisabled: boolean = false;

  /**
   * Disables the search action button independently of the text input.
   * @default false
   * @type boolean
   * @renamedFrom disableIcon
   */
  @Input() searchButtonDisabled: boolean = false;

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
   * Determines where the search button is rendered relative to the input
   * @default 'after'
   * @type 'before' | 'after'
   */
  @Input() searchButtonPosition: 'before' | 'after' = 'after';

  /**
   * Defines input behavior: number or percentage
   * @default 'text'
   * @type 'text' | 'number' | 'percentage'
   */
  @Input() inputType: 'text' | 'number' | 'percentage' = 'text';

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
   * Tooltip text or translation key for the search button.
   * @default ""
   * @type string
   * @renamedFrom searchBtnToolTip
   */
  @Input() searchButtonTooltip: string = '';

  /**
   * Emits when the component model-change handler runs.
   * @payload SearchInputModelChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onModelChange
   */
  @Output() modelChange: EventEmitter<SearchInputModelChangeEvent> =
    new EventEmitter<SearchInputModelChangeEvent>();

  /**
   * Emits from the existing input/change handler.
   * @payload SearchInputInputEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onInputChange
   */
  @Output() inputChanged: EventEmitter<SearchInputInputEvent> =
    new EventEmitter<SearchInputInputEvent>();

  /**
   * Emits when the inner field gains focus.
   * @payload SearchInputFocusEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onFocusChange
   */
  @Output() focusGained: EventEmitter<SearchInputFocusEvent> =
    new EventEmitter<SearchInputFocusEvent>();

  /**
   * Emits when the inner field loses focus.
   * @payload SearchInputBlurEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onBlurChange
   */
  @Output() focusLost: EventEmitter<SearchInputBlurEvent> =
    new EventEmitter<SearchInputBlurEvent>();

  /**
   * Emits on the inner field keydown event.
   * @payload SearchInputKeydownEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeydownHandle
   */
  @Output() keyPressed: EventEmitter<SearchInputKeydownEvent> =
    new EventEmitter<SearchInputKeydownEvent>();

  /**
   * Emits on the inner field keyup event.
   * @payload SearchInputKeyupEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyupHandle
   */
  @Output() keyReleased: EventEmitter<SearchInputKeyupEvent> =
    new EventEmitter<SearchInputKeyupEvent>();

  /**
   * Emits when Enter is released in the inner field.
   * @payload SearchInputKeyEnterEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onKeyEnterHandle
   */
  @Output() enterPressed: EventEmitter<SearchInputKeyEnterEvent> =
    new EventEmitter<SearchInputKeyEnterEvent>();

  /**
   * Emits when the inner input is clicked.
   * @payload SearchInputClickEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onInputClickHandle
   */
  @Output() inputClicked: EventEmitter<SearchInputClickEvent> =
    new EventEmitter<SearchInputClickEvent>();

  /**
   * Emits when the search action is activated.
   * @payload SearchInputInfo
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onSearchClickHandle
   */
  @Output() searchClicked: EventEmitter<SearchInputInfo> = new EventEmitter<SearchInputInfo>();

  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeDetectorRef);
  }

  /**
   * Returns shared field information attached
   * to all emitted events.
   *
   * Includes:
   * - Input DOM reference (if inputId is provided)
   * - Current model value
   * - Field identifier
   */

  private fieldInfo(): SearchInputInfo {
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

  /**
   * Emits when search button field is clicked
   */
  onSearchClick() {
    this.searchClicked.emit(this.fieldInfo());
  }
}
