import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectorRef,
  DestroyRef,
  inject,
  Optional,
  Self,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { NgControl } from '@angular/forms';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';

export interface TabOption {
  label: string;
  value: any;
  disabled?: boolean;
  /** @deprecated Use disabled. */
  disable?: boolean;
}

@Component({
  selector: 'ui-segmented-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './segmented-control.component.html',
  styleUrls: ['./segmented-control.component.scss'],
})
export class SegmentedControlComponent
  extends BaseControlValueAccessor<any>
  implements AfterViewInit
{
  /**
   * Options rendered by the control; use the label/value key inputs for object options.
   * @default []
   * @type TabOption[]
   */
  @Input() options: TabOption[] = [];
  get currentValue(): any {
    return this.value;
  }
  /**
   * Selected segment value, backed by the shared form value.
   * @type any
   */
  @Input()
  set currentValue(val: any) {
    this.value = val;
  }
  /**
   * Segmented-control size: md or lg.
   * @default 'md'
   * @type 'md' | 'lg'
   */
  @Input() size: 'md' | 'lg' = 'md';
  /**
   * Emits when the selection handler processes a selection.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   */
  @Output() selectionChange = new EventEmitter<any>();
  /**
   * Emits measured segment widths in pixels, in option order.
   * @payload number[]
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   */
  @Output() widthCalculated = new EventEmitter<number[]>();

  @ViewChildren('btn') buttons!: QueryList<ElementRef>;
  public buttonWidths: number[] = [];

  // Find the index of the currently selected value
  get activeIndex(): number {
    return this.options.findIndex((opt) => opt.value === this.currentValue);
  }

  // Calculate the 'left' position by summing widths of previous buttons
  get activeOffset(): number {
    if (this.activeIndex === -1 || this.buttonWidths.length === 0) return 0;
    return this.buttonWidths.slice(0, this.activeIndex).reduce((acc, width) => acc + width, 0);
  }

  // Get the width of the currently active button
  get activeWidth(): number {
    if (this.activeIndex === -1 || this.buttonWidths.length === 0) return 0;
    return this.buttonWidths[this.activeIndex];
  }

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    private changeRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeRef);
  }

  ngAfterViewInit() {
    this.calculateWidths();
    this.buttons.changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.calculateWidths());
  }

  calculateWidths() {
    if (this.buttons) {
      // Map the widths into our local array
      this.buttonWidths = this.buttons.map((btn) => btn.nativeElement.offsetWidth);
      // Emit for parent components if needed
      this.widthCalculated.emit(this.buttonWidths);
      // Ensure Angular sees the updated buttonWidths array
      this.cdr?.markForCheck();
    }
  }

  select(value: any) {
    if (
      this.disabled ||
      this.options.some((option) => option.value === value && (option.disabled || option.disable))
    )
      return;
    this.currentValue = value;
    this.commitValue(value);
    this.selectionChange.emit(value);
  }
}
