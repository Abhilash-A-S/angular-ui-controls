import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

/** Registers bundled icons in a private namespace without external requests. */
@Injectable({ providedIn: 'root' })
export class UiIconsService {
  constructor() {
    const registry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    const paths: Record<string, string> = {
      check: '<path d="m5 12 4 4L19 6"/>',
      close: '<path d="m6 6 12 12M18 6 6 18"/>',
      upload: '<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>',
      search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
      visible:
        '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
      hidden:
        '<path d="m3 3 18 18M9 5a11 11 0 0 1 3 0c6 0 10 7 10 7a19 19 0 0 1-3 4M6 6a22 22 0 0 0-4 6s4 7 10 7a12 12 0 0 0 5-1"/>',
    };
    for (const [name, path] of Object.entries(paths)) {
      // The markup is a fixed local constant; no consumer text enters this trust boundary.
      registry.addSvgIconLiteralInNamespace(
        'ui',
        name,
        sanitizer.bypassSecurityTrustHtml(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`,
        ),
      );
    }
  }
}
