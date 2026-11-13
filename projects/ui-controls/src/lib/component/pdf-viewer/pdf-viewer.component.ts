import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'ui-pdf-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfViewerComponent {
  /** Safe resource URL processed by DomSanitizer for iframe consumption */
  public urlSafe!: SafeResourceUrl;

  /** Accessible title for the embedded document. */
  @Input() title = 'PDF document';
  private readonly sanitizer = inject(DomSanitizer);
  /**
   * Resource URL embedded in the viewer. The current implementation trusts this URL; callers must supply a trusted source.
   * @type string
   */
  @Input()
  set pdfUrl(pdfUrl: string) {
    this.urlSafe = '';
    if (!pdfUrl) return;
    const parsed = new URL(
      pdfUrl,
      typeof document === 'undefined' ? 'https://localhost/' : document.baseURI,
    );
    if (!['https:', 'http:', 'blob:'].includes(parsed.protocol)) {
      throw new Error('pdfUrl must use HTTPS, HTTP, or a blob URL.');
    }
    parsed.hash = 'toolbar=0&navpanes=0&view=FitH';
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(parsed.href);
  }
}
