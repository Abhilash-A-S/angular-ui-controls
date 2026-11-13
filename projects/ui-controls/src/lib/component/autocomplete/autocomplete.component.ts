import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  Optional,
  Self,
  ChangeDetectorRef,
  viewChild,
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LibraryCommonService } from '../../services/library-common.service';
import { Subject, takeUntil } from 'rxjs';
import { Language } from '../../models/language-model';
import { AutocompleteModel } from './model/autocomplete-model';
import { MaterialModule } from '../../material.module';
import { UiUtilitiesModule } from '../../utilities';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import { NgControl } from '@angular/forms';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

export const AUTOCOMPLETE_MODEL = { value: '', fieldId: '', fieldName: '' };
@Component({
  selector: 'ui-autocomplete',
  standalone: true,
  imports: [MaterialModule, UiUtilitiesModule, ScrollingModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
})
export class AutocompleteComponent
  extends BaseControlValueAccessor<any>
  implements OnInit, AfterViewInit, AfterViewChecked
{
  // Unique ID for the input element (used for accessibility or testing);
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

  // Current text typed in the input field;
  public searchText: string = '';

  /**
   * Requests the existing read-only behavior without disabling the parent form control.
   * @default false
   * @type boolean
   */
  @Input() readonly: boolean = false;

  /**
   * Marks this control as required in its existing template; parent-form validators remain separately configured.
   * @default false
   * @type boolean
   */
  @Input() required: boolean = false;

  /**
   * Options rendered by the control; use the label/value key inputs for object options.
   * @default []
   * @renamedFrom autoCompleteList
   */
  @Input() options: any[] = [];

  /**
   * Label text or translation key displayed for this control.
   * @default ''
   * @type string
   */
  @Input() label: string = '';

  /**
   * Maximum character length for the autocomplete input.
   * @default 0
   * @type number
   */
  @Input() maxLength: number = 0;

  /**
   * Legacy character-limit input bound to maxlength (not a word counter). Retained separately from maxLength; existing precedence is unchanged.
   * @deprecated Use maxLength.
   * @default 0
   * @type number
   */
  @Input() wordsLimit: number = 0;

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
   * @renamedFrom bindValueKey
   */
  @Input() valueKey: string = '';

  /**
   * Optional resolver returning an ngClass value for each option (conditional coloring/styling). Receives the raw option and may return a string, string[] or { className: boolean } map.
   * @default null
   * @type ((option: any) => string | string[] | Set<string> | Record<string, boolean>) | null
   */
  @Input() optionNgClass:
    | ((option: any) => string | string[] | Set<string> | Record<string, boolean>)
    | null = null;

  /**
   * Additional CSS class or classes applied to the existing overlay panel.
   * @default ''
   * @type string | string[]
   */
  @Input() panelClass: string | string[] = '';

  get panelClassList(): string {
    const classes = Array.isArray(this.panelClass) ? [...this.panelClass] : [this.panelClass];
    if (this.virtualScroll) {
      classes.push('ui-virtual-scroll-panel');
    }
    return classes.filter(Boolean).join(' ');
  }

  /**
   * to show error message
   * @default ''
   * @type string
   */
  @Input() errorMessage: string = '';

  /**
   * Renders the options inside a cdk virtual scroll viewport (use for large lists)
   * @default false
   * @type boolean
   */
  @Input() virtualScroll: boolean = false;

  /**
   * Keeps each option on a single line with ellipsis; full text is shown in a tooltip on hover when truncated
   * @default false
   * @type boolean
   */
  @Input() singleLineOption: boolean = false;

  /**
   * Height (px) of a single option row; must match the rendered mat-option height when virtualScroll is on
   * @default 48
   * @type number
   */
  @Input() virtualScrollItemSize: number = 48;

  /**
   * Maximum height (px) of the virtual scroll viewport (mat-autocomplete panel max-height is 256px)
   * @default 256
   * @type number
   */
  @Input() virtualScrollMaxHeight: number = 256;
  // Keeps each option on a single line with ellipsis; full text is shown in a tooltip on hover when truncated
  // @Input() singleLineOption: boolean = false;

  // Configuration object for autocomplete behavior
  private _autoCompleteModel: AutocompleteModel = { value: '', fieldId: '', fieldName: '' };

  /**
   * Autocomplete value and field metadata object; its value is synchronized with the shared control value.
   * @type AutocompleteModel
   * @renamedFrom autoCompleteModel
   */
  @Input()
  get autocompleteModel(): AutocompleteModel {
    this._autoCompleteModel.value = this.value;
    return this._autoCompleteModel;
  }
  set autocompleteModel(model: AutocompleteModel) {
    if (model) {
      this._autoCompleteModel = model;
      if (model.value !== undefined) {
        this.value = model.value;
      }
    }
  }

  /**
   * Flag to indicate validation error state (used with reactive forms)
   * @default false
   */
  @Input() error = false;

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
   * Emits the existing value-change payload; remains separate from modelChange.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom inputChangeValue
   */
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();

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
  @ViewChild('autoComplete') autoComplete!: NgModel;

  // Virtual scroll viewport (only present when virtualScroll is enabled and the panel is open)
  private virtualScrollViewport = viewChild(CdkVirtualScrollViewport);

  // Last viewport height (px) the virtual scroll viewport was measured at; -1 = not measured
  private measuredViewportHeight = -1;
  constructor(
    private libraryCommonService: LibraryCommonService,
    private translate: TranslateService,
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeDetectorRef);
  }
  private readonly destroyRef = inject(DestroyRef);
  /**
   * Angular lifecycle hook.
   * Subscribes to language change events and updates
   * the default translation language accordingly.
   */
  ngOnInit(): void {
    this.libraryCommonService
      .getLanguageChange()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((changedlanguage: Language) => {
        this.translate.setDefaultLang(changedlanguage.value);
      });
  }

  /**
   * Angular lifecycle hook.
   * Marks the autocomplete form control as touched
   * after the view has been fully initialized.
   * This helps trigger validation visuals if required.
   */
  ngAfterViewInit() {
    // Validation starts when the user leaves the control, not during initialization.
  }

  /**
   * Handles changes in the input text field.
   * Updates the local searchText value.
   * If the input is cleared, resets the autocomplete model
   * and emits a selection change event.
   *
   * @param changeEvent - DOM input event
   */
  searchTextChanges(changeEvent: any) {
    this.searchText = changeEvent?.target?.value ?? '';
    if (!this.searchText) {
      this.autocompleteModel.value = '';
      this.onSelectionChange();
    }
  }

  /**
   * Determines the display value for an autocomplete option.
   * Priority:
   * 1. labelKey of the list item matching a bound primitive value (e.g. an id)
   * 2. valueKey
   * 3. labelKey
   * 4. fallback to the option itself
   *
   * @param autocompleteOption - Selected autocomplete object or bound value
   * @returns string - Value to display in the input field
   */
  autoCompleteBindvalue = (autocompleteOption: any): string => {
    if (!autocompleteOption) {
      return '';
    }
    if (typeof autocompleteOption !== 'object' && this.valueKey && this.labelKey) {
      const matchedOption = this.options?.find?.(
        (option: any) => option?.[this.valueKey] === autocompleteOption,
      );
      if (matchedOption) {
        return matchedOption[this.labelKey];
      }
    }
    return (
      autocompleteOption[this.valueKey] ?? autocompleteOption[this.labelKey] ?? autocompleteOption
    );
  };

  /**
   * Builds a shared payload object used by all emitted events.
   * Includes:
   * - Input DOM reference (if inputId is provided)
   * - Current autocomplete model value
   * - Text field identifier
   *
   * @returns object - Common event payload
   */
  private fieldInfo() {
    let inputRef = null;
    if (this.effectiveId) {
      inputRef = typeof document === 'undefined' ? null : document.getElementById(this.effectiveId);
    }
    return {
      ...(inputRef && { inputRef: inputRef }),
      value: this.autocompleteModel,
      textFieldName: this.fieldName,
    };
  }

  /**
   * Emits an event whenever the bound model value changes.
   * Typically triggered by Angular's ngModelChange.
   */
  public modelValueChange() {
    this.value = this._autoCompleteModel.value;
    this.commitValue();
    this.modelChange.emit(this.fieldInfo());
  }

  /**
   * Emits an event on every input value change (typing).
   * Used for live search or filtering behaviors.
   */
  public inputChange() {
    this.inputChanged.emit(this.fieldInfo());
  }

  /**
   * Emits an event when the input field gains focus.
   */
  public focusChange() {
    this.focusGained.emit(this.fieldInfo());
  }

  /**
   * Emits an event when the input field loses focus.
   */
  public blurChange() {
    this.focusLost.emit(this.fieldInfo());
  }

  /**
   * Emits the raw keyboard event when a key is pressed down.
   *
   * @param event - KeyboardEvent triggered on keydown
   */
  public keydownHandle(event: KeyboardEvent) {
    this.keyPressed.emit(event);
  }

  /**
   * Emits the raw keyboard event when a key is released.
   *
   * @param event - KeyboardEvent triggered on keyup
   */

  public keyupHandle(event: KeyboardEvent) {
    this.keyReleased.emit(event);
  }

  /**
   * Emits an event when the Enter key is pressed.
   *
   * @param event - Keyboard or form submit event
   */
  public keyEnterHandle(event: Event) {
    this.enterPressed.emit(event);
  }

  /**
   * Handles selection changes from the autocomplete dropdown.
   * Emits the selected value and resets the search text.
   */
  public onSelectionChange() {
    this.valueChanged.emit(this.fieldInfo());
    this.searchText = '';
  }

  /**
   * Calculates the virtual scroll viewport height so short lists
   * don't leave empty space and long lists are capped.
   *
   * @param count - Number of filtered options
   * @returns number - Viewport height in px
   */
  public getViewportHeight(count: number = 0): number {
    return Math.min(count * this.virtualScrollItemSize, this.virtualScrollMaxHeight);
  }

  /**
   * The viewport height follows the filtered list length, but cdk only measures
   * its size on init. If it was created while the list was empty (height 0) it
   * renders no rows, so mat-autocomplete sees no options and never shows the
   * panel while typing. Re-measure whenever the bound height changes.
   */
  ngAfterViewChecked(): void {
    const viewport = this.virtualScrollViewport();
    if (!this.virtualScroll || !viewport) return;
    const boundHeight = parseFloat(viewport.elementRef.nativeElement.style.height) || 0;
    if (boundHeight !== this.measuredViewportHeight) {
      this.measuredViewportHeight = boundHeight;
      setTimeout(() => viewport.checkViewportSize());
    }
  }

  /**
   * Track function for cdkVirtualFor.
   */
  public trackByFn = (index: number, option: any) =>
    this.valueKey && option ? (option[this.valueKey] ?? index) : index;

  /**
   * The viewport is measured while the overlay is being attached,
   * so re-measure once the panel is rendered to avoid a blank list.
   */
  public onPanelOpened() {
    if (!this.virtualScroll) return;
    setTimeout(() => this.virtualScrollViewport()?.checkViewportSize());
  }

  /**
   * Reset the virtual scroll position so the next open starts from the top.
   */
  public onPanelClosed() {
    this.measuredViewportHeight = -1;
    this.virtualScrollViewport()?.scrollToOffset(0);
  }
}
