export interface IDecoupledEditorConfig {
  toolbar: {
    items: string[];
  };
  image: {
    resizeUnit: string;
    toolbar: string[];
  };
  table: {
    contentToolbar: string[];
  };
  list: {
    properties: {
      styles: boolean;
      startIndex: boolean;
      reversed: boolean;
    };
  };
  language: string;
  fontSize: {
    options: number[];
  };
}
