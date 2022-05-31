export default class ExtSessionStorage {
  static set(items: any): Promise<void> {
    return chrome.storage.session.set(items);
  }

  static get(keys?: string|string[]|undefined): Promise<any> {
    return chrome.storage.session.get(keys);
  }
}
