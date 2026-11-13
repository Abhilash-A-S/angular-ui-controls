import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  inject,
  DestroyRef,
  Optional,
  Self,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { RichTextEditorService } from './rich-text-editor.service';
import RichTextEditorImageUpload from './rich-text-editor-image-upload';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { LibraryCommonService } from '../../services/library-common.service';
import { Language } from '../../models/language-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'ui-rich-text-editor',
  standalone: true,
  imports: [FormsModule, CKEditorModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.scss',
})
export class RichTextEditorComponent extends BaseControlValueAccessor<string> implements OnInit {
  /** Controls editor rendering (used for language reload) */
  public showEditor: boolean = true;
  /** CKEditor license configuration; GPL requires a GPL-compatible use case. */
  @Input() licenseKey = 'GPL';

  /** CKEditor decoupled editor reference */
  public decoupledEditor: any;
  public editorLoadError = false;
  @Output() editorLoadFailed = new EventEmitter<unknown>();

  /** Injected text editor configuration service */
  private textEditorService = inject(RichTextEditorService);

  /** CKEditor configuration object */
  public editorConfig: any = {
    ...this.textEditorService.TEXT_EDITOR_CONFIG,
    toolbar: {
      ...this.textEditorService.TEXT_EDITOR_CONFIG.toolbar,
      items: [...this.textEditorService.TEXT_EDITOR_CONFIG.toolbar.items],
    },
  };

  /** Unique input identifier */
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
   * Direct binding to the component model, backed by its existing value accessor.
   * @type string
   */
  @Input()
  get modelValue(): string {
    return this.value || '';
  }
  set modelValue(val: string) {
    this.value = val;
  }

  /**
   * Toolbar item identifiers removed from the editor configuration.
   * @default []
   * @type string[]
   * @renamedFrom removeToolList
   */
  @Input() hiddenToolbarItems: string[] = [];

  /**
   * Editor type identifier
   * @default ''
   * @type string | number
   */
  @Input() editorType: string | number = '';

  /**
   * Enables or disables resize option
   * @default false
   * @type boolean
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() resize: boolean = false;

  /**
   * Clipboard restriction flag retained with its current wiring. The local uiPreventClipboard directive blocks copy, cut, and paste when true.
   * @default false
   * @type boolean
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() preventCopyPasteCut: boolean = false;

  /**
   * Label text or translation key displayed for this control.
   * @default ''
   * @type string
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() label: string = '';

  /**
   * Displays validation error state
   * @default false
   * @type boolean
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() error: boolean = false;

  /**
   * Marks this control as required in its existing template; parent-form validators remain separately configured.
   * @default false
   * @type boolean
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() required: boolean = false;

  /**
   * Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved.
   * @type string | number
   * @renamedFrom textFieldName
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() fieldName!: string | number;

  /**
   * Hint text or translation key displayed while the control is empty.
   * @default ''
   * @type string
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() placeholder: string = '';

  /**
   * Requests the existing read-only behavior without disabling the parent form control.
   * @default false
   * @type boolean
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() readonly: boolean = false;

  /**
   * Emits when the component model-change handler runs.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   */
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Emits when the control loses focus.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onBlur
   */
  @Output() blurred: EventEmitter<any> = new EventEmitter<any>();
  private readonly destroyRef = inject(DestroyRef);
  constructor(
    private libraryCommonService: LibraryCommonService,
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeDetectorRef);
  }

  /**
   * Component initialization lifecycle hook
   * - Removes toolbar items based on input list
   * - Updates editor language dynamically
   *
   * @returns void
   */
  ngOnInit(): void {
    this.configureToolbar();
    this.editorConfig.placeholder = this.placeholder;
    this.editorConfig.licenseKey = this.licenseKey;
    if (typeof window !== 'undefined') {
      import('ckeditor5')
        .then((editor) => {
          if (this.destroyRef.destroyed) return;
          this.editorConfig.plugins = [
            editor.Essentials,
            editor.Paragraph,
            editor.Bold,
            editor.Italic,
            editor.Underline,
            editor.Strikethrough,
            editor.Heading,
            editor.Font,
            editor.Alignment,
            editor.Link,
            editor.Image,
            editor.ImageUpload,
            editor.ImageToolbar,
            editor.ImageCaption,
            editor.ImageStyle,
            editor.ImageResize,
            editor.Table,
            editor.TableToolbar,
            editor.List,
            editor.ListProperties,
            editor.BlockQuote,
            editor.Indent,
            editor.IndentBlock,
          ];
          this.decoupledEditor = editor.DecoupledEditor;
          this.changeDetectorRef.markForCheck();
        })
        .catch((error) => {
          if (this.destroyRef.destroyed) return;
          this.editorLoadError = true;
          this.editorLoadFailed.emit(error);
          this.changeDetectorRef.markForCheck();
        });
    }
    this.libraryCommonService
      .getLanguageChange()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((language: Language) => {
        this.editorConfig.language = language.value;
        this.showEditor = false;
        setTimeout(() => {
          this.showEditor = true;
        });
      });
  }

  /**
   * Filters CKEditor toolbar items
   * Removes tools listed in hiddenToolbarItems input
   *
   * @returns void
   */
  /** @deprecated Use configureToolbar. */
  CheckRemoveToolList(): void {
    this.configureToolbar();
  }

  configureToolbar(): void {
    this.editorConfig.toolbar.items = this.editorConfig.toolbar.items.filter(
      (toolbar: string) => !this.hiddenToolbarItems.includes(toolbar),
    );
  }

  /**
   * CKEditor ready callback
   * - Moves toolbar above editable area
   * - Registers custom image upload adapter
   *
   * @param editor CKEditor instance
   * @returns void
   */
  onReady(editor: any): void {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());

    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new RichTextEditorImageUpload(loader, editor.config);
    };
  }

  /**
   * Handles editor content change
   * Emits updated value to parent component
   *
   * @returns void (emits modelChange)
   */
  onChangeHandler(): void {
    this.modelChange.emit({
      editorType: this.editorType,
      modelValue: this.modelValue,
    });
  }

  /**
   * Handles editor blur event
   * Reserved for future validation or touch handling
   *
   * @returns void
   */
  onBlurHandler(): void {
    this.onTouchedCallback();
    this.blurred.emit({
      editorType: this.editorType,
      modelValue: this.modelValue,
    });
  }
}
