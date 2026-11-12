import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RichTextEditorService {
  public TEXT_EDITOR_CONFIG: any = {
    licenseKey: 'GPL',
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'heading',
        '|',
        'fontfamily',
        'fontsize',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'link',
        'uploadImage',
        'insertTable',
        'blockQuote',
        '|',
        'alignment',
        '|',
        'bulletedList',
        'numberedList',
        'outdent',
        'indent'
      ]
    },
    image: {
      resizeUnit: 'px',
      toolbar: [
        'imageStyle:inline',
        'imageStyle:wrapText',
        'imageStyle:breakText',
        '|',
        'toggleImageCaption',
        'imageTextAlternative'
      ]
    },
    table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'] },
    list: { properties: { styles: true, startIndex: true, reversed: true } },
    language: 'en',
    fontSize: {
      options: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
    }
  };
  constructor() { }
}
