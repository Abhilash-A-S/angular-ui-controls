import { TestBed } from '@angular/core/testing';

import { RichTextEditorService } from './rich-text-editor.service';

describe('TextEditorService', () => {
  let service: RichTextEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RichTextEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
