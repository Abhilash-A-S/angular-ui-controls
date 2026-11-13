import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Optional,
  Self,
  ViewChild,
  forwardRef,
  OnDestroy,
  OnChanges,
  DoCheck,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MentionModule } from 'angular-mentions';
import { Subject } from 'rxjs';
import { AbbreviationEntry, AbbreviationMentionConfig } from './models';
import { highlightTokens, HighlightToken } from './input-rules';

/** Editable textarea with safe abbreviation/restricted-word highlighting and Material form-field integration. */
@Component({
  selector: 'ui-abbreviation-textarea',
  standalone: true,
  imports: [CommonModule, MentionModule],
  templateUrl: './abbreviation-textarea.component.html',
  styleUrl: './abbreviation-textarea.component.scss',
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => AbbreviationTextareaComponent),
    },
  ],
  host: { '[attr.id]': 'id', '[class.disabled]': 'disabled' },
})
export class AbbreviationTextareaComponent
  implements ControlValueAccessor, MatFormFieldControl<string>, OnDestroy, OnChanges, DoCheck
{
  private static nextId = 0;
  @Input() id = `ui-abbreviation-${AbbreviationTextareaComponent.nextId++}`;
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() required = false;
  /** @deprecated Use readonly. */
  @Input() readOnly = false;
  @Input() get readonly(): boolean {
    return this.readOnly;
  }
  set readonly(value: boolean) {
    this.readOnly = value;
  }
  @Input() maxLength: number | null = null;
  @Input() minRows = 2;
  @Input() maxRows = 2;
  @Input() preventCopy = false;
  @Input() preventCut = false;
  @Input() preventPaste = false;
  @Input() abbreviationList: AbbreviationEntry[] = [];
  @Input() restrictedWords: AbbreviationEntry[] = [];
  @Input() mentionConfig: AbbreviationMentionConfig[] | null = null;
  @Input() assistantFieldId = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() controlTextChange = new EventEmitter<string>();
  @Output() focusIn = new EventEmitter<FocusEvent>();
  @Output() focusOut = new EventEmitter<FocusEvent>();
  @ViewChild('input') input?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('highlight') highlight?: ElementRef<HTMLElement>;
  readonly stateChanges = new Subject<void>();
  readonly controlType = 'ui-abbreviation-textarea';
  readonly autofilled = false;
  focused = false;
  errorState = false;
  describedBy = '';
  tokens: HighlightToken[] = [];
  mentionOptions: any = { mentions: [] };
  private text = '';
  private change: (value: string) => void = () => {};
  private touched: () => void = () => {};
  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (ngControl) ngControl.valueAccessor = this;
  }
  @Input() get value(): string {
    return this.text;
  }
  set value(value: string | null) {
    this.text = value ?? '';
    this.refresh();
  }
  get empty(): boolean {
    return !this.text;
  }
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }
  ngOnChanges(): void {
    this.mentionOptions = {
      mentions: (this.mentionConfig ?? []).map((config) => ({
        items: config.items ?? [],
        triggerChar: config.triggerChar ?? '@',
        labelKey: config.labelKey ?? 'abbreviation',
        mentionSelect:
          config.mentionSelect ??
          ((item: any) => String(item.remarks ?? item.abbreviation ?? item.label ?? '')),
      })),
    };
    this.refresh();
  }
  ngDoCheck(): void {
    const error = !!(this.ngControl?.invalid && (this.ngControl.touched || this.ngControl.dirty));
    if (error !== this.errorState) {
      this.errorState = error;
      this.stateChanges.next();
    }
  }
  private refresh(): void {
    this.tokens = highlightTokens(this.text, this.abbreviationList, this.restrictedWords);
    this.stateChanges.next();
  }
  writeValue(value: string | null): void {
    this.value = value;
  }
  registerOnChange(fn: (value: string) => void): void {
    this.change = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.stateChanges.next();
  }
  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(): void {
    if (!this.disabled) this.input?.nativeElement.focus();
  }
  onInput(event: Event): void {
    this.value = (event.target as HTMLTextAreaElement).value;
    this.change(this.text);
    this.controlTextChange.emit(this.text);
    this.valueChange.emit(this.text);
  }
  onFocus(event: FocusEvent): void {
    this.focused = true;
    this.stateChanges.next();
    this.focusIn.emit(event);
  }
  onBlur(event: FocusEvent): void {
    this.focused = false;
    this.touched();
    this.stateChanges.next();
    this.focusOut.emit(event);
  }
  syncScroll(): void {
    if (this.input && this.highlight) {
      this.highlight.nativeElement.scrollTop = this.input.nativeElement.scrollTop;
      this.highlight.nativeElement.scrollLeft = this.input.nativeElement.scrollLeft;
    }
  }
  block(event: ClipboardEvent, prevent: boolean): void {
    if (prevent) event.preventDefault();
  }
  ngOnDestroy(): void {
    this.stateChanges.complete();
  }
}
