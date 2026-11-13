export default class RichTextEditorImageUpload {
  private loader;
  private reader: { abort: () => void } | undefined;
  private config;

  constructor(loader: any, config: any) {
    this.loader = loader;
    this.config = config;
  }

  public async upload(): Promise<any> {
    const value = await this.loader.file;
    return this.read(value);
  }

  private read(file: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      this.reader = reader;
      reader.onabort = () => reject();
      reader.onerror = (error) => reject(error);
      reader.onload = () => resolve({ default: reader.result });
      reader.readAsDataURL(file);
    });
  }

  abort() {
    if (this.reader) {
      this.reader.abort();
    }
  }
}
