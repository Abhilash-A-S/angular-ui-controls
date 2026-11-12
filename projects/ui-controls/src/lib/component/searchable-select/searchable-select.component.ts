import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, signal, Signal, computed, viewChildren, viewChild, Optional, Self, ChangeDetectorRef, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { UiUtilitiesModule } from '../../utilities';
import {
  SearchableSelectOption, SearchableSelectToggleAllEvent,
  SearchableSelectSelectionChangeEvent,
  SearchableSelectOpenCloseEvent,
  SearchableSelectFieldInfo,
  SearchableSelectOptionClickEvent
} from './searchable-select.interface';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import { NgControl } from '@angular/forms';
import { IsEmptyPipe } from './is-empty.pipe';

@Component({
  selector: 'ui-searchable-select',
  standalone: true,
  imports: [MaterialModule, UiUtilitiesModule, ScrollingModule, IsEmptyPipe],
  templateUrl: './searchable-select.component.html',
  styleUrl: './searchable-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchableSelectComponent extends BaseControlValueAccessor<any> {
  /**
   * Height in pixels of each option for virtual scrolling (defaults to 36px)
   * @default 36
   * @type number
   */
  @Input() itemSize: number = 36;

  /**
   * Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true.
   * @default false
   * @type boolean
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() preventCopyPasteCut: boolean = false;

  /** HTML id for the select element */
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
   * Enable the search in the option
   * @default true
   * @type boolean
   */
  @Input() showSearch: boolean = true;

  /**
   * Error message shown when validation fails
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
   * Placeholder text for the select field
   * @default ''
   * @type string
   */
  @Input() selectPlaceholder: string = '';

  /**
   * Placeholder text for search input
   * @default ''
   * @type string
   */
  @Input() searchPlaceholder: string = '';

  /**
   * Requests the existing read-only behavior without disabling the parent form control.
   * @default false
   * @type boolean
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() readonly: boolean = false;

  /**
   * Enables multi-select behavior
   * @default false
   * @type boolean
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() isMultiSelect: boolean = false;

  /**
   * Displays "Select All" checkbox
   * @default false
   * @type boolean
   */
  @Input() showToggleAllCheckbox: boolean = false;

  /**
   * Label shown when no entries are found
   * @default 'No Entries Found'
   * @type string
   */
  @Input() noEntriesFoundLabel: string = 'No Entries Found';

  /**
   * Tooltip message for select-all checkbox
   * @default ''
   * @type string
   */
  @Input() toggleAllCheckboxTooltipMessage: string = '';

  /**
   * Shows checkbox in search area
   * @default false
   * @type boolean
   * @renamedFrom showSearchCheckBox
   */
  @Input() showSearchCheckbox: boolean = false;

  /**
   * Enables the existing multiple-selection mode.
   * @default false
   * @type boolean
   * @renamedFrom showMultiSelect
   */
  @Input() multiple: boolean = false;

  /**
   * Options rendered by the control; use the label/value key inputs for object options.
   * @default []
   * @type SearchableSelectOption[]
   * @renamedFrom selectList
   */
  @Input() options: SearchableSelectOption[] = [];

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
   * Key in option object used to determine if the option should be hidden from dropdown. Defaults to 'isHidden'.
   * @default 'isHidden'
   * @type string
   */
  @Input() hiddenKey: string = 'isHidden';

  /**
   * Enables server-side/external search by bypassing local pipe filtering
   * @default false
   * @type boolean
   */
  @Input() serverSideSearch: boolean = false;

  /** Search text entered by the user */
  public searchText: string = '';

  private _modelValueTracker = signal<any>(null);
  private _internalModelValue: any = null;

  private isBlankValue(value: any): boolean {
    return value === null || value === undefined || value === '';
  }

  public get hasSelectedValue(): boolean {
    const value = this._internalModelValue;
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return !this.isBlankValue(value);
  }

  /** Internal model bound to mat-select */
  public get inputModelValue(): any {
    return this._internalModelValue;
  }
  public set inputModelValue(value: any) {
    this._internalModelValue = value;
    // Filter out "All" for the external form control value
    let cleanValue = value;
    if (this.multiple && Array.isArray(value)) {
      cleanValue = value.filter(item => !this.compareObjects(item, this._allOptionObj));
    }
    if (!this.areValuesEqual(cleanValue, this.value)) {
      this.value = cleanValue;
    }
    this._modelValueTracker.set(value);
  }

  public internalSelectList: any[] = [];
  private _allOptionObj: any = null;
  private modelNameMapping: Map<string, string> = new Map();
  private multiSelectInternalList: any[] = [];
  /**
   * Direct binding to the component model, backed by its existing value accessor.
   */
  @Input()
  get modelValue(): any {
    return this.inputModelValue;
  }
  set modelValue(modelvalue: any) {
    if (this.valueKey && !this.multiple) {
      this.inputModelValue = modelvalue?.[this.valueKey] ?? modelvalue;
    } else {
      this.inputModelValue = modelvalue;
      this.syncMultiSelectModel();
    }
  }

  /** Enable/disable search in the starting/conatin mode */
  public filterConditionStartWith: boolean = false;
  /**
   * Configuration for search starts with.
   * @type boolean
   * @renamedFrom isSearchStartsWith
   */
  @Input()
  set searchStartsWith(condition: boolean) {
    this.filterConditionStartWith = condition;
  }
  /**
   * To clear the selected dropdown list
   * @default false
   * @type boolean
   */
  @Input() showClearIcon: boolean = false;

  /**
   * Emits when the select-all action runs.
   * @payload SearchableSelectToggleAllEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom toggleSelectHandle
   */
  @Output() selectAllChange: EventEmitter<SearchableSelectToggleAllEvent> = new EventEmitter<SearchableSelectToggleAllEvent>();

  /**
   * Emits when the selection handler processes a selection.
   * @payload SearchableSelectSelectionChangeEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onselectionChange
   */
  @Output() selectionChange: EventEmitter<SearchableSelectSelectionChangeEvent> = new EventEmitter<SearchableSelectSelectionChangeEvent>();

  /**
   * Emits when the select panel open state changes.
   * @payload SearchableSelectOpenCloseEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onOpenedChange
   */
  @Output() panelOpenChange: EventEmitter<SearchableSelectOpenCloseEvent> = new EventEmitter<SearchableSelectOpenCloseEvent>();

  /**
   * Emits when the select panel opens.
   * @payload SearchableSelectFieldInfo
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onOpened
   */
  @Output() panelOpened: EventEmitter<SearchableSelectFieldInfo> = new EventEmitter<SearchableSelectFieldInfo>();

  /**
   * Emits when the select panel closes.
   * @payload SearchableSelectFieldInfo
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onClosed
   */
  @Output() panelClosed: EventEmitter<SearchableSelectFieldInfo> = new EventEmitter<SearchableSelectFieldInfo>();

  /**
   * Emits when the control loses focus.
   * @payload SearchableSelectFieldInfo
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onBlur
   */
  @Output() blurred: EventEmitter<SearchableSelectFieldInfo> = new EventEmitter<SearchableSelectFieldInfo>();

  /**
   * Emits when an option is clicked.
   * @payload SearchableSelectOptionClickEvent
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onOptionClick
   */
  @Output() optionClicked: EventEmitter<SearchableSelectOptionClickEvent> = new EventEmitter<SearchableSelectOptionClickEvent>();

  /**
   * Emits the updated search string for consumer filtering.
   * @payload string
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onSearchTextModelChange
   */
  @Output() searchTextChange: EventEmitter<string> = new EventEmitter<string>();

  // Get references to all MatOption instances rendered in the view
  private virtualOptions = viewChildren<MatOption>('virtualOption');

  // Reference to the underlying mat-select so parents can open/close it programmatically
  private matSelectRef = viewChild(MatSelect);
  // Get reference to the virtual scroll viewport
  private virtualScroll = viewChild(CdkVirtualScrollViewport);

  // Signal that stores values selected by the user
  // but currently NOT rendered inside the virtual scroll viewport
  public hiddenOptions: Signal<any[]>;

  /**
   * Key used to map model value to option
   * @default false
   * @type boolean
   */
  @Input() enableAllOption: boolean = false;

  /**
   * Removes the "All" option that is otherwise added automatically in multi-select mode
   * @default false
   * @type boolean
   */
  @Input() hideAllOption: boolean = false;

  /**
   * Key used to enable / disable sorting
   * @default false
   * @type boolean
   */
  @Input() enableSorting: boolean = false;

  /**
   * Keeps each option on a single line with ellipsis; full text is shown in a tooltip on hover when truncated
   * @default false
   * @type boolean
   */
  @Input() singleLineOption: boolean = false;

  /**
   * Defines whether the list should be sorted in ascending order.
   * @type boolean
   */
  @Input() set sortAscending(sortOrder: boolean) {
    this.isAscendingOrder = sortOrder;
    if (this.enableSorting) {
      this.sortInternalSelectList();
    }
  }
  /** Key used to enable / disable sorting */
  private isAscendingOrder: boolean = true;

  /**
   * Key used to sort the array
   * @type string
   */
  @Input() set sortKey(key: string) {
    this.sortKeyValue = key;
    if (this.enableSorting) {
      this.sortInternalSelectList();
    }
  }

  private sortKeyValue: string = "";

  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(ngControl, changeDetectorRef);
    // Computed signal that recalculates whenever:
    // - virtualOptions change
    // - inputModelValue changes
    this.hiddenOptions = computed(() => {

      // Create a Set of currently rendered option values
      // This makes lookup O(1) when checking if a value exists
      const virtualOptions = new Set(
        this.virtualOptions().map((matOption) => this.getOptionKey(matOption.value)),
      );
      const selectedValue = this._modelValueTracker();

      // A blank value (null / undefined / '' / 0) is "no selection" - do not
      // create a hidden option for it, otherwise mat-select treats the field
      // as filled and floats the label on an empty control.
      if (this.isBlankValue(selectedValue)) {
        return [];
      }

      const selectedArray = Array.isArray(selectedValue)
        ? selectedValue
        : [selectedValue];

      // Return selected values that are real and NOT currently rendered
      // in the virtual scroll viewport
      return selectedArray.filter(
        (value) => !this.isBlankValue(value) && !virtualOptions.has(this.getOptionKey(value)),
      );
    });
  }

  /** Identifies an option by valueKey, so a parent replacing options with new objects keeps the same option */
  private getOptionKey(option: any): any {
    return this.valueKey && option !== null && typeof option === 'object' ? option[this.valueKey] : option;
  }
  /**
   * Intercept values written by Angular Forms framework (e.g., ngModel)
   */
  public override writeValue(value: any): void {
    // 1. Call the base implementation to update this._value
    super.writeValue(value);
    // 2. Initialize internal value
    this._internalModelValue = value;
    // 3. Sync "All" option if needed
    this.syncMultiSelectModel();
    // 4. Keep your signal tracker in sync so hiddenOptions computes properly
    this._modelValueTracker.set(this._internalModelValue);
  }
  trackByFn = (index: number, item: any): any => {
    return this.valueKey && item ? item[this.valueKey] : (item?.id ?? item);
  };

  compareObjects = (option1: any, option2: any): boolean => {
    if (this.valueKey && option1 != null && option2 != null) {
      const val1 = typeof option1 === 'object' ?
        option1 === "" ? this.modelValue[this.valueKey]
          : option1[this.valueKey]
        : option1 === "" ? this.inputModelValue : option1;
      const val2 = typeof option2 === 'object' ? option2[this.valueKey] : option2;
      return val1 === val2;
    }
    return option1 === option2;
  };
  private fieldInfo(): any {
    let inputRef: Element | null = null;
    if (this.effectiveId) {
      inputRef = document.querySelector(`#${this.effectiveId}`);
    }
    return {
      ...(inputRef && { inputRef }),
      modelValue: this.multiple ?
        (Array.isArray(this.inputModelValue) ? this.inputModelValue : []).filter((selectionOption: any) => !this.compareObjects(selectionOption, this._allOptionObj)) :
        this.getSelectedModelValue(this.inputModelValue),
      textFieldName: this.fieldName
    };
  }
  getSelectedModelValue(selectedValue: any) {
    if (!this.options) return selectedValue ?? this.inputModelValue;
    return this.options.find((selectionItem) =>
      selectionItem[this.valueKey] === selectedValue) ?? this.inputModelValue;
  }

  /**
 * Emits when the selected value changes in the dropdown.
 *
 * @param handleSelectionChange - MatSelect change event containing selected value(s)
 * @returns void
 */
  public handleSelectionChange(event: MatSelectChange): void {
    if (this.multiple) {
      const emittedSelection = this.multiSelectInternalList.filter(item => !this.compareObjects(item, this._allOptionObj));
      this.inputModelValue = [...this.multiSelectInternalList];
      this.multiSelectInternalList = [];
      this.selectionChange.emit({
        ...this.fieldInfo(),
        selectionChange: { value: emittedSelection, source: event.source as any }
      });
    } else {
      this.inputModelValue = event.value;
      this.selectionChange.emit({
        ...this.fieldInfo(),
        selectionChange: event
      });
    }
  }

  /**
 * Handles select-all toggle action from search checkbox.
 *
 * @param selectAllValue - True to select all options, false to clear selection
 * @returns void
 */
  public toggleSelectAll(selectAllValue: boolean): void {
    if (this.multiple && selectAllValue) {
      this.inputModelValue = [...this.internalSelectList];
    } else {
      this.inputModelValue = [];
    }
    this.selectAllChange.emit({
      ...this.fieldInfo(),
      selectAllValue
    });
  }

  handleOpenedChange(isOpen: boolean): void {
    const virtualScroll = this.virtualScroll();
    if (!isOpen) {
      this.searchText = '';
      this._cachedOptionWidth = 0;
      if (virtualScroll) {
        // Reset scroll position back to the top
        virtualScroll.scrollToOffset(0);
        // Force viewport to recalculate its size
        // Ensures proper rendering next time it opens
        virtualScroll.checkViewportSize();
      }
    } else if (virtualScroll) {
      setTimeout(() => {
        virtualScroll.checkViewportSize();
      });
    }
  }

  /**
 * Emits when the open state of the dropdown changes.
 *
 * @param changeEvent - Boolean indicating open (true) or closed (false) state
 * @returns void
 */
  public openedChange(opened: boolean): void {
    this.panelOpenChange.emit({
      ...this.fieldInfo(),
      selectionChange: opened
    });
  }
  /**
 * Emits when the dropdown panel is opened.
 *
 * @returns void
 */
  public opened(): void {
    this.panelOpened.emit(this.fieldInfo());
  }
  /**
 * Emits when the dropdown panel is closed.
 *
 * @returns void
 */
  public closed(): void {
    this.panelClosed.emit(this.fieldInfo());
  }

  /**
 * Emits when the select element loses focus.
 *
 * @returns void
 */
  public blur(): void {
    this.blurred.emit(this.fieldInfo());
  }

  /**
 * Emits when a select option is clicked.
 *
 * @param selectedOption - The option object that was clicked
 * @returns void
 */
  public optionClick(selectedOption: any): void {
    // Basic event emission. All select logic is processed declaratively inside handleSelectionChange()
    this.optionClicked.emit({ activeOption: selectedOption });
  }
  searchTextModelChange(changedSearchText: string): void {
    this.searchTextChange.emit(changedSearchText);
  }
  private _cachedOptionWidth: number = 0;

  isTooltipDisabled(optionRef: any, text: string): boolean {
    const textStr = String(text ?? "");
    if (textStr.length < 20) return true;

    if (!this._cachedOptionWidth && optionRef?._element?.nativeElement?.clientWidth) {
      this._cachedOptionWidth = optionRef._element.nativeElement.clientWidth;
    }
    if (this._cachedOptionWidth) {
      const avgCharWidth = 7;
      return (textStr.length * avgCharWidth) < this._cachedOptionWidth;
    }
    return false;
  }
  getTriggerText(): string {
    if (this.multiple) {
      if (Array.isArray(this.inputModelValue) && this.inputModelValue.length > 0) {
        const isAllSelected = this.inputModelValue.find(
          item => this.compareObjects(item, this._allOptionObj)
        );

        if (isAllSelected) {
          return this.labelKey ? this._allOptionObj[this.labelKey] : "All";
        } else {
          return this.inputModelValue
            .map((options: any) => this.modelNameMapping.get(options[this.valueKey] ?? options) ?? options)
            .join(", ");
        }
      }
      return "";
    }

    return (this.modelNameMapping.get(this.inputModelValue as string)
      || (this.inputModelValue?.[this.labelKey] || "")
      || String(this.inputModelValue ?? ""));
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['options'] ||
      changes['multiple'] ||
      changes['labelKey'] ||
      changes['valueKey'] ||
      changes['hiddenKey'] ||
      changes['hideAllOption']
    ) {
      this.updateInternalList();
      this.syncMultiSelectModel();
    }
  }

  /**
   * Generates the internal scroll list, automatically injecting
   * an "All" option if multiple mode is active, and filtering out hidden options.
   */
  private updateInternalList() {
    const list = (this.options || []).filter(item => !item?.[this.hiddenKey]);

    if ((this.multiple || this.enableAllOption) && !this.hideAllOption) {
      if (this.valueKey || this.labelKey) {
        // Keep the same object when options is replaced. A new object is not recognised as a
        // rendered option, so it would get a hidden duplicate that takes the checked state.
        const canReuseAllOption = this._allOptionObj &&
          (!this.valueKey || this._allOptionObj[this.valueKey] === 'All') &&
          (!this.labelKey || this._allOptionObj[this.labelKey] === 'All');
        if (!canReuseAllOption) {
          this._allOptionObj = {
            ...(this.valueKey ? { [this.valueKey]: 'All' } : {}),
            ...(this.labelKey ? { [this.labelKey]: 'All' } : {})
          };
        }
      } else {
        this._allOptionObj = 'All';
      }

      const hasAll = list.some(item => this.compareObjects(item, this._allOptionObj));
      if (!hasAll) {
        this.internalSelectList = [this._allOptionObj, ...list];
      } else {
        this.internalSelectList = [...list];
        this._allOptionObj = list.find(item => this.compareObjects(item, this._allOptionObj));
      }
    } else {
      this._allOptionObj = null;
      this.internalSelectList = [...list];
    }

    this.modelNameMapping.clear();
    // Populate modelNameMapping from the full list so selected hidden items can still resolve label in trigger
    for (const option of (this.options || [])) {
      if (this.valueKey && option) {
        this.modelNameMapping.set((option[this.valueKey] ?? option), (option[this.labelKey] ?? option));
      }
    }
    if (this._allOptionObj && this.valueKey) {
      this.modelNameMapping.set((this._allOptionObj[this.valueKey] ?? this._allOptionObj), (this._allOptionObj[this.labelKey] ?? this._allOptionObj));
    }

    if (this.enableSorting) {
      this.sortInternalSelectList();
    }
  }

  /**
   * Ensures the inputModelValue incorporates or removes the "All" item automatically
   * based on whether every single standard item has been selected or not.
   */
  private syncMultiSelectModel(): void {
    if (!this.multiple || !this.options?.length || !this.internalSelectList?.length) return;
    if (!Array.isArray(this._internalModelValue)) return;

    const currentRealItems = this._internalModelValue.filter(item => !this.compareObjects(item, this._allOptionObj));
    const selectableCount = this.internalSelectList.filter(item => !this.compareObjects(item, this._allOptionObj)).length;

    if (currentRealItems.length > 0 && currentRealItems.length === selectableCount) {
      this._internalModelValue = [...this.internalSelectList];
      this._modelValueTracker.set(this._internalModelValue);
    } else {
      this._internalModelValue = currentRealItems;
      this._modelValueTracker.set(this._internalModelValue);
    }
  }

  private areValuesEqual(val1: any, val2: any): boolean {
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) return false;
      return val1.every(item => val2.some(other => this.compareObjects(item, other)));
    }
    return this.compareObjects(val1, val2);
  }
  // Make sure to add this import at the top of the file if needed, or fully qualify it in typing
  public optionSelectionChange(event: any, option: any): void {
    if (!event.isUserInput || !this.multiple) return;

    const isChecking = event.source.selected;
    const isAllObj = this.compareObjects(option, this._allOptionObj);

    let currentVal = Array.isArray(this.inputModelValue) ? [...this.inputModelValue] : [];
    let baseItems = currentVal.filter(item => !this.compareObjects(item, this._allOptionObj));

    if (isChecking) {
      if (isAllObj) {
        this.multiSelectInternalList = [...this.internalSelectList];
      } else {
        if (!baseItems.some(item => this.compareObjects(item, option))) {
          baseItems.push(option);
        }
        const selectableCount = this.internalSelectList.filter(item => !this.compareObjects(item, this._allOptionObj)).length;
        if (baseItems.length === selectableCount) {
          this.multiSelectInternalList = [...this.internalSelectList];
        } else {
          this.multiSelectInternalList = baseItems;
        }
      }
    } else {
      if (isAllObj) {
        this.multiSelectInternalList = [];
      } else {
        this.multiSelectInternalList = baseItems.filter(item => !this.compareObjects(item, option));
      }
    }
  }
  /** Opens the dropdown panel programmatically */
  open(): void {
    this.matSelectRef()?.open();
  }

  clearSelect() {
    this.inputModelValue = null;
    if (this.multiple) {
      this.inputModelValue = [];
    }
    this.selectionChange.emit({
      ...this.fieldInfo(),
      selectionChange: null
    });
  }
  private sortInternalSelectList(): void {
    this.internalSelectList.sort((firstValue: any, secondValue: any) => {
      const key = this.sortKeyValue || this.labelKey;

      const first = key ? firstValue?.[key] : firstValue;
      const second = key ? secondValue?.[key] : secondValue;

      const sortResult = String(first ?? "").localeCompare(
        String(second ?? ""),
        undefined,
        {
          numeric: true,
          sensitivity: "base"
        }
      );

      return this.isAscendingOrder ? sortResult : -sortResult;
    });
  }
}