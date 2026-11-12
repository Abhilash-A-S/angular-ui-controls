import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, Signal, signal, viewChild, viewChildren, ViewEncapsulation, Optional, Self, ChangeDetectorRef } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { UiUtilitiesModule } from '../../utilities';
import {
  SearchableSelectOption, SearchableSelectToggleAllEvent,
  SearchableSelectSelectionChangeEvent,
  SearchableSelectOpenCloseEvent,
  SearchableSelectFieldInfo,
  SearchableSelectOptionClickEvent
} from './advanced-select.interface';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NgControl } from '@angular/forms';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';

@Component({
  selector: 'ui-advanced-select',
  standalone: true,
  imports: [MaterialModule, UiUtilitiesModule, ScrollingModule],
  templateUrl: './advanced-select.component.html',
  styleUrl: './advanced-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedSelectComponent extends BaseControlValueAccessor<any> implements OnInit, OnChanges, OnChanges {
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
   * @default 'No records found'
   * @type string
   */
  @Input() noEntriesFoundLabel: string = 'No records found';

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
   * Key in option object used to determine if the option should be hidden from dropdown. Defaults to 'isHidden'.
   * @default 'isHidden'
   * @type string
   */
  @Input() hiddenKey: string = 'isHidden';

  /**
   * Enables grouped select display
   * @default false
   * @type boolean
   */
  @Input() isGroupingEnabled: boolean = false;

  /**
   * Property key for group label (defaults to '')
   * @default ''
   * @type string
   */
  @Input() groupLabelKey: string = '';

  /**
   * Property key for group child options array (defaults to '')
   * @default ''
   * @type string
   */
  @Input() groupChildrenKey: string = '';

  public internalSelectList: any[] = [];
  public rawOptionsList: any[] = [];
  private fullSelectableOptions: any[] = [];
  private allSelectableOptions: any[] = [];

  public get hasNoMatchingEntries(): boolean {
    return !this.internalSelectList?.length;
  }

  /**
   * Key used to map model value to option
   * @default false
   * @type boolean
   */
  @Input() enableAllOption: boolean = false;

  /**
   * Key used to enable / disable sorting
   * @default false
   * @type boolean
   */
  @Input() enableSorting: boolean = false;

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
  private sortKeyValue: string = '';

  private _allOptionObj: any = null;
  private modelNameMapping: Map<string, string> = new Map();
  private multiSelectInternalList: any[] = [];

  /**
   * Enables multiple options display
   * @default false
   * @type boolean
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() isMultiOptions: boolean = false;

  /**
   * To clear the selected dropdown list
   * @default false
   * @type boolean
   */
  @Input() showClearIcon: boolean = false;

  /**
   * Conatins the multiple options
   * @default []
   * @type string[]
   */
  @Input() displayFields: string[] = [];

  /**
   * Option text layout: inline joins the display fields; split separates primary and secondary fields.
   * @default 'inline'
   * @type 'split' | 'inline'
   */
  @Input() layoutMode: 'split' | 'inline' = 'inline';

  /**
   * Enables server-side/external search by bypassing local pipe filtering
   * @default false
   * @type boolean
   */
  @Input() serverSideSearch: boolean = false;

  /**
   * Keeps each option on a single line with ellipsis; full text is shown in a tooltip on hover when truncated
   * @default false
   * @type boolean
   */
  @Input() singleLineOption: boolean = false;

  /** Search text entered by the user */
  public searchText: string = '';

  private _modelValueTracker = signal<any>(null);

  /** Internal model bound to mat-select */
  private _inputModelValue: any = null;
  public get inputModelValue(): any {
    return this._inputModelValue;
  }
  public set inputModelValue(value: any) {
    this._inputModelValue = value;
    let cleanValue = value;
    if (this.multiple && Array.isArray(value)) {
      cleanValue = value.filter(item => !this.compareObjects(item, this._allOptionObj));
    }
    if (!this.areValuesEqual(cleanValue, this.value)) {
      this.value = cleanValue;
    }
    this._modelValueTracker.set(value);
  }

  /**
   * Direct binding to the component model, backed by its existing value accessor.
   */
  @Input()
  get modelValue(): any {
    return this.value;
  }
  set modelValue(modelvalue: any) {
    this.value = modelvalue;
    this.inputModelValue = modelvalue;
    if (this.valueKey) {
      this.configureModelValue(modelvalue);
    }
    this.syncMultiSelectModel();
  }

  override writeValue(modelvalue: any): void {
    super.writeValue(modelvalue);
    this._inputModelValue = modelvalue;
    this._modelValueTracker.set(modelvalue);
    if (this.valueKey) {
      this.configureModelValue(modelvalue);
    }
    this.syncMultiSelectModel();
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
    this.applyFilter();
  }
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

  // Get reference to the virtual scroll viewport
  private virtualScroll = viewChild(CdkVirtualScrollViewport);

  // Get reference to the underlying mat-select so parents can open/close it programmatically
  private matSelectRef = viewChild(MatSelect);

  // Signal that stores values selected by the user
  // but currently NOT rendered inside the virtual scroll viewport
  public hiddenOptions: Signal<any[]>;

  constructor(@Optional() @Self() public override ngControl: NgControl,
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
        this.virtualOptions().map((matOption) => matOption.value),
      );
      const selectedValue = this._modelValueTracker();

      // If there is a selected value (single or multiple)
      if (selectedValue !== null && selectedValue !== undefined) {
        const selectedArray = Array.isArray(selectedValue)
          ? selectedValue
          : [selectedValue];

        // Return selected values that are NOT currently rendered
        // in the virtual scroll viewport
        return selectedArray.filter((value) => !virtualOptions.has(value));
      }

      // If nothing is selected, return empty array
      return [];
    });
  }
  trackByFn = (index: number, item: any): any => {
    if (item?.isGroupHeader) {
      return `header_${item?.[this.groupLabelKey] ?? index}`;
    }
    return this.valueKey && item ? item[this.valueKey] : (item?.id ?? item);
  };

  private areValuesEqual(val1: any, val2: any): boolean {
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) return false;
      return val1.every(item => val2.some(other => this.compareObjects(item, other)));
    }
    return this.compareObjects(val1, val2);
  }

  compareObjects = (option1: any, option2: any): boolean => {
    if (this.valueKey && option1 != null && option2 != null) {
      const val1 = typeof option1 === 'object' ?
        option1 === "" ? this.modelValue?.[this.valueKey]
          : option1[this.valueKey]
        : option1 === "" ? this.inputModelValue : option1;
      const val2 = typeof option2 === 'object' ? option2[this.valueKey] : option2;
      return val1 === val2;
    }
    return option1 === option2;
  };

  handleOpenedChange(isOpen: boolean): void {
    const virtualScroll = this.virtualScroll();
    if (!isOpen) {
      this.searchText = '';
      this.applyFilter();
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
  * Returns shared field information
  * attached to all emitted events
  */
  private fieldInfo(): SearchableSelectFieldInfo {
    let inputRef: Element | null = null;
    if (this.effectiveId) {
      inputRef = document.querySelector(`#${this.effectiveId}`);
    }
    return {
      ...(inputRef && { inputRef: inputRef }),
      modelValue: this.multiple ?
        (Array.isArray(this.inputModelValue) ? this.inputModelValue.filter((selectionOption: any) => !this.compareObjects(selectionOption, this._allOptionObj)) : this.inputModelValue) :
        this.getSelectedModelValue(this.inputModelValue),
      textFieldName: this.fieldName
    };
  }

  getSelectedModelValue(selectedValue: any) {
    const listToSearch = this.isGroupingEnabled
      ? (this.fullSelectableOptions?.length ? this.fullSelectableOptions : this.allSelectableOptions)
      : (this.allSelectableOptions?.length ? this.allSelectableOptions : this.options);
    if (!listToSearch) return selectedValue ?? this.inputModelValue;
    return listToSearch.find((selectionItem) =>
      (this.valueKey ? selectionItem[this.valueKey] === selectedValue || selectionItem[this.valueKey] === selectedValue?.[this.valueKey] : selectionItem === selectedValue)
    ) ?? this.inputModelValue;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.labelKey && this.displayFields?.length) {
      this.labelKey = this.displayFields[0];
    }
    if (
      changes['options'] ||
      changes['multiple'] ||
      changes['isMultiSelect'] ||
      changes['labelKey'] ||
      changes['displayFields'] ||
      changes['valueKey'] ||
      changes['hiddenKey'] ||
      changes['isGroupingEnabled'] ||
      changes['groupLabelKey'] ||
      changes['groupChildrenKey']
    ) {
      this.updateInternalList();
      if (this.valueKey && ![undefined, null].includes(this.inputModelValue)) {
        this.configureModelValue(this.inputModelValue as MatSelectChange);
      }
      this.syncMultiSelectModel();
    }
  }

  private updateInternalList(): void {
    this.allSelectableOptions = [];
    this.fullSelectableOptions = [];

    if (this.isGroupingEnabled) {
      for (const group of (this.options || []) as any[]) {
        const rawChildren = (group?.[this.groupChildrenKey] || []) as any[];
        const children = rawChildren.filter((item) => !item?.[this.hiddenKey]);
        this.fullSelectableOptions.push(...children);
      }
      this.modelNameMapping.clear();
      const key = this.labelKey || (this.displayFields?.length ? this.displayFields[0] : '');
      for (const option of this.fullSelectableOptions) {
        if (this.valueKey && option) {
          const label = this.getOptionText(option) || (key ? option[key] : option);
          this.modelNameMapping.set(option[this.valueKey] ?? option, label);
        }
      }
      this.rebuildGroupedList();
      return;
    }

    const list = (this.options || []).filter(item => !item?.[this.hiddenKey]);
    this.allSelectableOptions = [...list];

    if (this.multiple || this.enableAllOption) {
      if (this.valueKey || this.labelKey) {
        this._allOptionObj = {
          ...(this.valueKey ? { [this.valueKey]: 'All' } : {}),
          ...(this.labelKey ? { [this.labelKey]: 'All' } : {})
        };
      } else {
        this._allOptionObj = 'All';
      }

      const hasAll = list.some(item => this.compareObjects(item, this._allOptionObj));
      if (!hasAll) {
        this.rawOptionsList = [this._allOptionObj, ...list];
      } else {
        this.rawOptionsList = [...list];
        this._allOptionObj = list.find(item => this.compareObjects(item, this._allOptionObj));
      }
    } else {
      this.rawOptionsList = [...list];
    }

    this.modelNameMapping.clear();
    const key = this.labelKey || (this.displayFields?.length ? this.displayFields[0] : '');
    for (const option of (this.options || [])) {
      if (this.valueKey && option) {
        const label = this.getOptionText(option) || (key ? option[key] : option);
        this.modelNameMapping.set((option[this.valueKey] ?? option), label);
      }
    }
    if (this._allOptionObj && this.valueKey) {
      this.modelNameMapping.set((this._allOptionObj[this.valueKey] ?? this._allOptionObj), (this._allOptionObj[this.labelKey] ?? this._allOptionObj));
    }

    if (this.enableSorting) {
      this.sortInternalSelectList();
    } else {
      this.applyFilter();
    }
  }

  public applyFilter(): void {
    if (this.isGroupingEnabled) {
      this.rebuildGroupedList();
      return;
    }

    if (this.serverSideSearch || !this.searchText?.trim()) {
      this.internalSelectList = [...this.rawOptionsList];
    } else {
      const term = this.searchText.trim().toLowerCase();
      this.internalSelectList = this.rawOptionsList.filter((item) => {
        if (this._allOptionObj && this.compareObjects(item, this._allOptionObj)) {
          return false;
        }
        const primaryText = this.labelKey ? item?.[this.labelKey] : null;
        if (primaryText != null) {
          const s = String(primaryText).toLowerCase();
          if (this.filterConditionStartWith ? s.startsWith(term) : s.includes(term)) {
            return true;
          }
        }
        const fullText = String(this.getOptionText(item) || item || '').toLowerCase();
        return this.filterConditionStartWith
          ? fullText.startsWith(term)
          : fullText.includes(term);
      });
    }
  }

  private syncMultiSelectModel(): void {
    const selectableList = this.isGroupingEnabled ? this.fullSelectableOptions : this.allSelectableOptions;
    if (!this.multiple || !selectableList?.length) return;
    if (!Array.isArray(this._inputModelValue)) return;

    const currentRealItems = this._inputModelValue.filter(item => !this.compareObjects(item, this._allOptionObj));
    const selectableCount = selectableList.length;

    if (currentRealItems.length > 0 && currentRealItems.length === selectableCount) {
      this._inputModelValue = this.isGroupingEnabled ? [...this.fullSelectableOptions] : [...this.rawOptionsList];
      this._modelValueTracker.set(this._inputModelValue);
    } else {
      this._inputModelValue = currentRealItems;
      this._modelValueTracker.set(this._inputModelValue);
    }
  }

  /**
  * Initializes component and resolves
  * model value when valueKey is present
  */
  ngOnInit(): void {
    if (!this.labelKey && this.displayFields?.length) {
      this.labelKey = this.displayFields[0];
    }
    this.updateInternalList();
    if (![undefined, null].includes(this.inputModelValue) && this.valueKey) {
      this.configureModelValue(this.inputModelValue as MatSelectChange);
    }
  }

  /** Secondary fields for split layout (excludes primary display key) */
  public get secondaryFields(): string[] {
    if (!this.displayFields?.length) {
      return [];
    }
    const primaryKey = this.labelKey || this.displayFields[0];
    return this.displayFields.filter((field) => field !== primaryKey);
  }

  /** Formats the trigger display text for the closed select input */
  public getTriggerText(): string {
    const key = this.labelKey || (this.displayFields?.length ? this.displayFields[0] : '');
    if (this.multiple) {
      if (Array.isArray(this.inputModelValue) && this.inputModelValue.length > 0) {
        const isAllSelected = this.inputModelValue.find(
          item => this.compareObjects(item, this._allOptionObj)
        );

        if (isAllSelected) {
          return this.labelKey ? this._allOptionObj[this.labelKey] : "All";
        } else {
          return this.inputModelValue
            .map((item: any) => {
              if (this.valueKey && item) {
                const mapped = this.modelNameMapping.get(item[this.valueKey] ?? item);
                if (mapped) return mapped;
              }
              return (key ? item?.[key] : item);
            })
            .filter((val: any) => val !== null && val !== undefined && val !== '')
            .join(', ');
        }
      }
      return '';
    }
    if (this.inputModelValue !== null && this.inputModelValue !== undefined) {
      if (this.valueKey && this.inputModelValue) {
        const lookupKey = typeof this.inputModelValue === 'object' ? this.inputModelValue[this.valueKey] : this.inputModelValue;
        const mapped = this.modelNameMapping.get(lookupKey);
        if (mapped) return mapped;
      }
      return (key ? this.inputModelValue?.[key] : this.inputModelValue) ?? '';
    }
    return '';
  }

  /**
   * Maps the incoming model value to a matching option
   * from the select list using the configured valueKey.
   *
   * @param modelvalue - Incoming model value from parent
   * @returns void
   */
  public configureModelValue(modelvalue: any): void {
    const candidateList = this.isGroupingEnabled
      ? (this.fullSelectableOptions?.length ? this.fullSelectableOptions : this.allSelectableOptions)
      : (this.allSelectableOptions?.length ? this.allSelectableOptions : this.options);
    if (this.isMultiSelect || this.multiple) {
      if (Array.isArray(modelvalue)) {
        const modelList = modelvalue.map((option) => (option && typeof option === 'object' && this.valueKey in option ? option[this.valueKey] : option));
        this.inputModelValue = candidateList.filter((option) => modelList.includes(option[this.valueKey]));
      }
    } else {
      this.inputModelValue = candidateList.find(
        (selectionItem) =>
          selectionItem[this.valueKey] === modelvalue
          || selectionItem[this.valueKey] === modelvalue?.[this.valueKey])
        || this.inputModelValue;
    }
  }

  private sortInternalSelectList(): void {
    const sortFn = (firstValue: any, secondValue: any) => {
      const key = this.sortKeyValue || this.labelKey || (this.displayFields?.length ? this.displayFields[0] : '');

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
    };

    this.rawOptionsList.sort(sortFn);
    this.applyFilter();
  }

  public optionSelectionChange(event: any, option: any): void {
    if (!event.isUserInput || !this.multiple) return;

    const isChecking = event.source.selected;
    const isAllObj = this.compareObjects(option, this._allOptionObj);

    let currentVal = Array.isArray(this.inputModelValue) ? [...this.inputModelValue] : [];
    let baseItems = currentVal.filter(item => !this.compareObjects(item, this._allOptionObj));

    const selectableList = this.isGroupingEnabled ? this.fullSelectableOptions : this.allSelectableOptions;
    const selectableCount = selectableList.length;

    if (isChecking) {
      if (isAllObj) {
        this.multiSelectInternalList = this.isGroupingEnabled ? [...this.fullSelectableOptions] : [...this.rawOptionsList];
      } else {
        if (!baseItems.some(item => this.compareObjects(item, option))) {
          baseItems.push(option);
        }
        if (baseItems.length === selectableCount) {
          this.multiSelectInternalList = this.isGroupingEnabled ? [...this.fullSelectableOptions] : [...this.rawOptionsList];
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

  /**
 * Emits when the selected value changes in the dropdown.
 *
 * @param handleSelectionChange - MatSelect change event containing selected value(s)
 * @returns void
 */
  public handleSelectionChange(selectionChange: MatSelectChange): void {
    this.selectionChange.emit({
      ...this.fieldInfo(),
      selectionChange: selectionChange
    });
  }

  /**
 * Handles select-all toggle action from search checkbox.
 *
 * @param selectAllValue - True to select all options, false to clear selection
 * @returns void
 */
  public toggleSelectAll(selectAllValue: boolean): void {
    const selectable = this.isGroupingEnabled
      ? (this.fullSelectableOptions?.length ? [...this.fullSelectableOptions] : [...this.allSelectableOptions])
      : [...this.allSelectableOptions];
    this.inputModelValue = selectAllValue ? selectable : [];
    this.selectAllChange.emit({
      ...this.fieldInfo(),
      selectAllValue
    });
  }

  /**
 * Emits when the open state of the dropdown changes.
 *
 * @param changeEvent - Boolean indicating open (true) or closed (false) state
 * @returns void
 */
  public openedChange(opened: boolean) {
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
  public opened() {
    this.panelOpened.emit(this.fieldInfo());
  }

  /**
 * Emits when the dropdown panel is closed.
 *
 * @returns void
 */
  public closed() {
    this.panelClosed.emit(this.fieldInfo());
  }

  /**
 * Emits when the select element loses focus.
 *
 * @returns void
 */
  public blur() {
    this.blurred.emit(this.fieldInfo());
  }

  /**
 * Emits when a select option is clicked.
 *
 * @param selectedOption - The option object that was clicked
 * @returns void
 */

  public optionClick(selectedOption: any) {
    if (selectedOption?.isGroupHeader) return;
    this.optionClicked.emit({
      activeOption: selectedOption
    });
  }

  public rebuildGroupedList(): void {
    const term = (this.searchText || '').trim().toLowerCase();
    const flattenedList: any[] = [];
    const groups = (this.options || []) as any[];

    this.allSelectableOptions = [];

    for (const group of groups) {
      const rawChildren = (group?.[this.groupChildrenKey] || []) as any[];
      const children = rawChildren.filter((item) => !item?.[this.hiddenKey]);

      // Filter children according to search term
      let matchingChildren = children;
      if (term) {
        matchingChildren = children.filter((child: any) => {
          const textVal = String(
            this.labelKey
              ? child?.[this.labelKey] ?? ''
              : (this.getOptionText(child) || child) ?? ''
          ).toLowerCase();
          return this.filterConditionStartWith
            ? textVal.startsWith(term)
            : textVal.includes(term);
        });
      }

      // Check if group header itself matches search term
      const groupHeaderTitle = String(
        group?.[this.groupLabelKey] ?? ''
      ).toLowerCase();
      const groupHeaderMatches = term ? groupHeaderTitle.includes(term) : false;

      // If group matches, keep all its children; otherwise keep matching children
      const childrenToInclude = groupHeaderMatches ? children : matchingChildren;

      if (childrenToInclude.length > 0) {
        flattenedList.push({
          isGroupHeader: true,
          [this.groupLabelKey]: group?.[this.groupLabelKey] ?? '',
          label: group?.[this.groupLabelKey] ?? '',
        });
        for (const child of childrenToInclude) {
          flattenedList.push(child);
          this.allSelectableOptions.push(child);
        }
      }
    }

    this.internalSelectList = flattenedList;
  }

  searchTextModelChange(changedSearchText: string) {
    this.searchText = changedSearchText ?? '';
    this.applyFilter();
    const virtualScroll = this.virtualScroll();
    if (virtualScroll) {
      virtualScroll.scrollToOffset(0);
      setTimeout(() => {
        virtualScroll.checkViewportSize();
      });
    }
    this.searchTextChange.emit(this.searchText);
  }
  /** Formats option text for tooltip and display matching the rendered layout */
  public getOptionText(option: any): string {
    if (!option) return '';
    if (this.layoutMode === 'split') {
      const primary = (this.labelKey ? option?.[this.labelKey] : option) ?? '';
      if (this.secondaryFields.length) {
        const secondary = this.secondaryFields
          .map((f) => option?.[f])
          .filter(Boolean)
          .join(' ');
        return secondary ? `${primary} - ${secondary}` : `${primary}`;
      }
      return `${primary}`;
    }
    if (this.displayFields?.length) {
      return this.displayFields
        .map((f) => option?.[f])
        .filter(Boolean)
        .join(' - ');
    }
    return (this.labelKey ? option?.[this.labelKey] : option) ?? '';
  }

  isTooltipDisabled(optionRef: any, text: string): boolean {
    if ((text?.length || 0) < 15) return true;
    const el = optionRef?._element?.nativeElement as HTMLElement;
    if (el) {
      const truncateEl = el.querySelector('.text-truncate') as HTMLElement;
      // Enable tooltip if horizontal scroll / text overflow is detected
      const hasHorizontalScroll =
        el.scrollWidth > el.clientWidth ||
        (truncateEl ? truncateEl.scrollWidth > truncateEl.clientWidth : false);

      if (hasHorizontalScroll) {
        return false;
      }
      // Check estimated character width
      if (el.clientWidth) {
        const avgCharWidth = 10;
        const estimatedWidth = (text?.length || 0) * avgCharWidth;
        return estimatedWidth < el.clientWidth;
      }
    }
    return false;
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
}
