export default class ExtSessionStorage {
  static set(items) {
    return chrome.storage.session.set(items);
  }

  static get(keys) {
    return chrome.storage.session.get(keys);
  }
}
