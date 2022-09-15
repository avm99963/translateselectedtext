// WARNING: In MV2, data is persisted even after the session ends,[1] unlike
// with chrome.storage.session in MV3.
//
// Before, this class in MV2 only persisted data until the background page was
// unloaded, so this introduced bug
// https://iavm.xyz/b/translateselectedtext/18.
//
// Thus, since making the background page persistent will impact performance,
// the easiest solution is to let this custom session storage be persistent in
// MV2, because persistence of this storage won't affect the extension, and
// although this solution isn't nice and could introduce some smaller bugs, MV2
// will be deprecated soon anyways.
//
// [1]: The only exception is the translatorTab value, which will be erased when
// the corresponding tab is closed. This is because after a browser restart,
// already used tab IDs can be reused again, so we could end up opening Google
// Translate in an unrelated tab otherwise.
//
// Also, we'll delete this value when starting the browser as another
// "protection layer", since closing the browser sometimes results in the
// onRemoved event not being handled.
//
// Keep in mind there are some edge cases where we could still be reusing an
// unrelated tab. A known one is when the extension is disabled for some period
// of time and afterwards enabled again, but there might be others.

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.remove('translatorTab');
});

chrome.tabs.onRemoved.addListener(tabId => {
  ExtSessionStorage.get('translatorTab').then(items => {
    if (tabId === items['translatorTab'])
      chrome.storage.local.remove('translatorTab');
  });
});

export default class ExtSessionStorage {
  static set(items: any): Promise<void> {
    return chrome.storage.local.set(items);
  }

  static get(keys: string|Array<string>|undefined): Promise<any> {
    return new Promise((res, _) => {
      chrome.storage.local.get(keys, items => {
        res(items);
      });
    });
  }
}
