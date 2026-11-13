import {
  booleanAttribute,
  Component,
  HostListener,
  EventEmitter,
  Input,
  Optional,
  Output,
  Self,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, FormsModule, ControlValueAccessor } from '@angular/forms';
import {
  SearchInputModelChangeEvent,
  SearchInputInputEvent,
  SearchInputFocusEvent,
  SearchInputBlurEvent,
  SearchInputKeydownEvent,
  SearchInputKeyupEvent,
  SearchInputKeyEnterEvent,
  SearchInputClickEvent,
  SearchInputInfo,
} from '../search-input/search-input.interface';
import { UiUtilitiesModule } from '../../utilities';
import { MaterialModule } from '../../material.module';

export interface SearchFilterValue {
  searchVal: string;
  selectVal: any;
}

@Component({
  selector: 'ui-search-filter',
  standalone: true,
  imports: [CommonModule, MaterialModule, UiUtilitiesModule, FormsModule],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss',
})
export class SearchFilterComponent implements ControlValueAccessor {
  /**
   * Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true.
   * @default false
   * @type boolean
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() preventCopyPasteCut: boolean = false;

  /** HTML id attribute for the input element */
  protected rawInputId: string = '';
  protected rawIdPrefix: string = '';
  public effectiveId: string = '';

  /**
   * Optional namespace prepended to inner control IDs to distinguish repeated instances.
   * @type string
   */
  @Input()
  set idPrefix(prefix: string) {
    this.rawIdPrefix = prefix || '';
    this.configureId();
  }
  get idPrefix(): string {
    return this.rawIdPrefix;
  }

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

  private configureId(): void {
    this.effectiveId =
      this.rawIdPrefix && this.rawInputId
        ? `${this.rawIdPrefix}_${this.rawInputId}`
        : this.rawInputId || '';
  }

  /**
   * Tooltip text displayed on hover
   * @default ''
   * @type string
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() tooltip: string = '';

  /**
   * Label displayed above the input field
   * @default ''
   * @type string
   */
  @Input() searchTextLabel: string = '';

  /**
   * Label displayed above the dropdown
   * @default ''
   * @type string
   */
  @Input() searchSelectLabel: string = '';

  /**
   * Legacy character-limit input bound to maxlength (not a word counter). Retained separately from maxLength; existing precedence is unchanged.
   * @default 0
   * @type number
   */
  @Input() wordsLimit: number = 0;

  protected _disabled: boolean = false;

  /**
   * Disables the control. Angular Forms can also update this state through setDisabledState.
   * @type boolean
   */
  @Input({ transform: booleanAttribute })
  set disabled(val: boolean) {
    this._disabled = val;
    this.cdr.markForCheck();
  }
  get disabled(): boolean {
    if (this.ngControl?.control) {
      return this.ngControl.control.disabled || this._disabled;
    }
    return this._disabled;
  }

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
   * Placeholder text for select dropdown
   * @default ''
   * @type string
   */
  @Input() selectPlaceholder: string = '';

  /**
   * Options rendered by the control; use the label/value key inputs for object options.
   * @default []
   * @type any[]
   * @renamedFrom selectList
   */
  @Input() options: any[] = [];

  /**
   * Property name read from an option object to obtain its visible label.
   * @default ''
   * @type string
   * @renamedFrom displayKey
   */
  @Input() labelKey: string = '';

  /**
   * Property name used to identify or extract an option value.
   * @default ''
   * @type string
   * @renamedFrom idKey
   */
  @Input() valueKey: string = '';

  /**
   * Enables the existing multiple-selection mode.
   * @default false
   * @type boolean
   * @renamedFrom showMultiSelect
   */
  @Input() multiple: boolean = false;

  /**
   * Show clear icon button in select dropdown
   * @default false
   * @type boolean
   */
  @Input() showClearIcon: boolean = false;

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

  /**
   * Emits when the selection handler processes a selection.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onselectionChange
   */
  @Output() selectionChange = new EventEmitter<any>();

  /**
   * Emits when the select panel open state changes.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onOpenedChange
   */
  @Output() panelOpenChange = new EventEmitter<any>();

  /**
   * Emits when the select panel opens.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onOpened
   */
  @Output() panelOpened = new EventEmitter<any>();

  /**
   * Emits when the select panel closes.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onClosed
   */
  @Output() panelClosed = new EventEmitter<any>();

  /**
   * Emits when the control loses focus.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onBlur
   */
  @Output() blurred = new EventEmitter<any>();

  /**
   * Emits when an option is clicked.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onOptionClick
   */
  @Output() optionClicked = new EventEmitter<any>();

  /**
   * Emits when the existing option-selection handler runs.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onOptionSelectionChange
   */
  @Output() optionSelectionChanged = new EventEmitter<any>();

  /** Compound model; legacy searchVal/selectVal keys remain stable. */
  @Input() get value(): SearchFilterValue | null {
    return this._value;
  }
  set value(value: SearchFilterValue | null) {
    this.writeValue(value);
  }
  @Output() valueChange = new EventEmitter<SearchFilterValue | null>();
  commitValue(): void {
    if (this.disabled) return;
    this.onChangeCallback(this._value);
    this.valueChange.emit(this._value);
  }
  @HostListener('focusout', ['$event'])
  handleFocusOut(event: FocusEvent): void {
    if (
      event.relatedTarget &&
      (event.currentTarget as HTMLElement)?.contains(event.relatedTarget as Node)
    )
      return;
    this.onTouchedCallback();
  }
  /** Internal value state */
  private _value: SearchFilterValue | null = null;

  public onChangeCallback: (value: SearchFilterValue | null) => void = () => {};
  public onTouchedCallback: () => void = () => {};

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private cdr: ChangeDetectorRef,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  /** ControlValueAccessor implementation */
  writeValue(value: SearchFilterValue | null): void {
    this._value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: SearchFilterValue | null) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.cdr.markForCheck();
  }

  /** Getters and setters for the internal form controls */
  public get modelValue(): string {
    return this._value?.searchVal ?? '';
  }

  public set modelValue(val: string) {
    const currentSelect = this.inputModelValue;
    this._value = {
      searchVal: val,
      selectVal: currentSelect,
    };
  }

  public get inputModelValue(): any {
    return this._value?.selectVal ?? (this.multiple ? [] : null);
  }

  public set inputModelValue(val: any) {
    const currentSearch = this.modelValue;
    this._value = {
      searchVal: currentSearch,
      selectVal: val,
    };
  }

  /** Returns shared field information attached to all emitted events. */
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

  /** Emits when the model value changes */
  public modelValueChange(modelChangeEvent: string): void {
    this.modelChange.emit({
      ...this.fieldInfo(),
      modelChangeEvent: modelChangeEvent,
    });
  }

  /** Emits on input value change */
  public inputChange(changeValue: Event): void {
    this.inputChanged.emit({
      ...this.fieldInfo(),
      changeEvent: changeValue,
    });
  }

  /** Emits when input gains focus */
  public focusChange(onFocusEvent: FocusEvent): void {
    this.focusGained.emit({
      ...this.fieldInfo(),
      focusEvent: onFocusEvent,
    });
  }

  /** Emits when input loses focus */
  public blurChange(blurEvent: FocusEvent): void {
    this.focusLost.emit({
      ...this.fieldInfo(),
      blurEvent: blurEvent,
    });
  }

  /** Emits on keydown action */
  public keydownHandle(keyDownEvent: KeyboardEvent): void {
    this.keyPressed.emit({
      ...this.fieldInfo(),
      keyDownEvent: keyDownEvent,
    });
  }

  /** Emits on keyup action */
  public keyupHandle(keyUpEvent: KeyboardEvent): void {
    this.keyReleased.emit({
      ...this.fieldInfo(),
      keyUpEvent: keyUpEvent,
    });
  }

  /** Emits when Enter key is pressed */
  public keyEnterHandle(event: Event): void {
    this.enterPressed.emit({
      ...this.fieldInfo(),
      keyEnterEvent: event,
    });
  }

  /** Emits when input field is clicked */
  public inputClick(clickEvent: MouseEvent): void {
    this.inputClicked.emit({
      ...this.fieldInfo(),
      clickEvent: clickEvent,
    });
  }

  /** Emits when search button is clicked */
  public onSearchClick(): void {
    this.searchClicked.emit(this.fieldInfo());
  }

  /** Emits dropdown selection change event */
  public handleSelectionChange(event: any): void {
    this.selectionChange.emit({
      ...this.fieldInfo(),
      selectionChange: event,
    });
  }

  /** Emits dropdown opened/closed change event */
  public openedChange(opened: boolean): void {
    this.panelOpenChange.emit({
      ...this.fieldInfo(),
      opened: opened,
      selectionChange: opened,
    });
  }

  /** Emits dropdown opened event */
  public opened(): void {
    this.panelOpened.emit(this.fieldInfo());
  }

  /** Emits dropdown closed event */
  public closed(): void {
    this.panelClosed.emit(this.fieldInfo());
  }

  /** Emits select dropdown blur event */
  public blur(): void {
    this.blurred.emit(this.fieldInfo());
  }

  /** Emits when a dropdown option selection changes */
  public optionSelectionChange(event: any, option: any): void {
    this.optionSelectionChanged.emit({ event, option });
  }

  /** Emits when a dropdown option is clicked */
  public optionClick(option: any): void {
    this.optionClicked.emit({ activeOption: option });
  }

  /** Clears select dropdown value */
  public clearSelect(): void {
    this.inputModelValue = this.multiple ? [] : null;
    this.commitValue();
    this.selectionChange.emit({
      ...this.fieldInfo(),
      selectionChange: null,
    });
  }
}
