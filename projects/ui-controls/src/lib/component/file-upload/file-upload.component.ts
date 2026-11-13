import {
  Component,
  EventEmitter,
  Input,
  Output,
  Optional,
  Self,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { UiUtilitiesModule } from '../../utilities';
import { BaseControlValueAccessor } from '../base-control-value-accessor.directive';

@Component({
  selector: 'ui-file-upload',
  standalone: true,
  imports: [MaterialModule, UiUtilitiesModule, FormsModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent extends BaseControlValueAccessor<any> {
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
   * @remarks Retained input; no consumer of this setting is present in the supplied class/template.
   */
  @Input() label: string = '';

  /**
   * Hint text or translation key displayed while the control is empty.
   * @default 'Select File'
   * @type string
   */
  @Input() placeholder: string = 'Select File';

  /**
   * Validation error message for empty/required fields
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
   * File types allowed (e.g. '.csv, .xlsx', 'image/*', '.pdf')
   * @default ''
   * @type string
   */
  @Input() accept: string = '';

  /**
   * Shows the clear button when a file is selected
   * @default true
   * @type boolean
   */
  @Input() showClearIcon: boolean = true;

  /**
   * Consumer-defined field identifier included in event metadata. Existing event payload key names are preserved.
   * @type string | number
   * @renamedFrom textFieldName
   */
  @Input() fieldName!: string | number;

  /**
   * Uses the existing drag/drop presentation with multiple file selection; false uses the single-file browse presentation.
   * @default false
   * @type boolean
   * @renamedFrom showFileDragDrop
   */
  @Input() showDropZone: boolean = false;

  /**
   * Emits after selected files pass the configured extension/MIME checks.
   * @payload any
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onFileSelect
   */
  @Output() fileSelected = new EventEmitter<any>();

  /**
   * Emits after the selected file is cleared.
   * @payload void
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onClear
   */
  @Output() cleared = new EventEmitter<void>();

  /**
   * Emits the validation message when a selected file fails the configured format check.
   * @payload string
   * @remarks Payload shape is unchanged; see the emitting handler for field metadata.
   * @renamedFrom onValidationError
   */
  @Output() validationError = new EventEmitter<string>();

  /** Allow multiple files independently of the visual drop zone. */
  @Input() multiple: boolean | null = null;
  private nativeFileInput?: HTMLInputElement;
  fileName: string = '';
  selectedFiles: FileList | null = null;
  isInvalidFile: boolean = false;
  fileFormatErrorMessage: string = '';
  get acceptedFiles() {
    return this.accept?.replace(/\*\/\*|\./g, '');
  }
  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, changeDetectorRef);
  }

  override writeValue(value: any): void {
    super.writeValue(value);
    if (!value && this.nativeFileInput) this.nativeFileInput.value = '';
    this.isInvalidFile = false;
    this.fileFormatErrorMessage = '';
    if (!value) {
      this.fileName = '';
      this.selectedFiles = null;
    } else if (typeof File !== 'undefined' && value instanceof File) {
      this.fileName = value.name;
    } else if (typeof FileList !== 'undefined' && value instanceof FileList) {
      this.selectedFiles = value;
      this.fileName = this.getFileNames(value);
    } else if (typeof value === 'string') {
      this.fileName = value;
    }
  }

  validateFile(file: File): boolean {
    if (!this.accept || this.accept === '*/*') {
      return true;
    }

    const acceptedTypes = this.accept.split(',').map((type) => type.trim().toLowerCase());
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    return acceptedTypes.some((type) => {
      if (type.startsWith('.')) {
        // Check file extension (e.g., '.csv')
        return fileName.endsWith(type);
      } else if (type.endsWith('/*')) {
        // Check wildcard MIME type (e.g., 'image/*')
        const category = type.split('/')[0];
        return fileType.startsWith(category + '/');
      } else {
        // Check exact MIME type (e.g., 'application/pdf')
        return fileType === type;
      }
    });
  }

  onFileChange(event: Event): void {
    if (this.disabled) return;
    const input = event.target as HTMLInputElement;
    this.nativeFileInput = input;
    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);
      const allValid = filesArray.every((file) => this.validateFile(file));

      if (!allValid) {
        this.isInvalidFile = true;
        this.fileFormatErrorMessage = `Invalid file format. Allowed: ${this.accept}`;
        this.fileName = '';
        this.selectedFiles = null;
        input.value = ''; // Clear native input

        this.commitValue(null);
        this.onTouchedCallback();
        this.validationError.emit(this.fileFormatErrorMessage);
        return;
      }

      this.isInvalidFile = false;
      this.fileFormatErrorMessage = '';
      this.selectedFiles = input.files;
      this.fileName = this.getFileNames(input.files);

      this.commitValue(this.selectedFiles);
      this.onTouchedCallback();
      this.fileSelected.emit({
        files: this.selectedFiles,
        fileName: this.fileName,
        fieldName: this.fieldName,
      });
    }
  }

  clearFile(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled) return;
    this.nativeFileInput?.value && (this.nativeFileInput.value = '');
    this.fileName = '';
    this.selectedFiles = null;
    this.isInvalidFile = false;
    this.fileFormatErrorMessage = '';
    this.commitValue(null);
    this.onTouchedCallback();
    this.cleared.emit();
  }

  private getFileNames(files: FileList): string {
    const names: string[] = [];
    for (let i = 0; i < files.length; i++) {
      names.push(files[i].name);
    }
    return names.join(', ');
  }
}
