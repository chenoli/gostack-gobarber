import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async save(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  public async delete(file: string): Promise<void> {
    this.storage.splice(this.storage.indexOf(file), 1);
  }
}
