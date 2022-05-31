import actionApi from './common/actionApi';
import {isoLangs} from './common/consts';
import Options from './common/options';
import ExtSessionStorage from './common/sessionStorage';

interface ContextMenuLangs {
  [id: string]: string;
}

function getTranslationUrl(lang: string, text: string): string {
  let params = new URLSearchParams({
    sl: 'auto',
    tl: lang,
    text: text,
    op: 'translate',
  });
  return 'https://translate.google.com/?' + params.toString();
}

function translationClick(
    info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab): void {
  let optionsPromise = Options.getOptions();
  let ssPromise = ExtSessionStorage.get(['contextMenuLangs', 'translatorTab']);
  Promise.all([optionsPromise, ssPromise])
      .then(returnValues => {
        const [options, sessionStorageItems] = returnValues;
        let url = getTranslationUrl(
            sessionStorageItems.contextMenuLangs?.[info.menuItemId],
            info.selectionText);
        let settings_tab = {url};
        if (sessionStorageItems.translatorTab && options.uniqueTab == 'yep') {
          chrome.tabs.update(
              sessionStorageItems.translatorTab, settings_tab, tab => {
                chrome.tabs.highlight(
                    {
                      windowId: tab.windowId,
                      tabs: tab.index,
                    },
                    () => {
                      chrome.windows.update(tab.windowId, {
                        focused: true,
                      });
                    });
              });
        } else if (options.uniqueTab == 'popup') {
          chrome.windows.create({
            type: 'popup',
            url,
            width: 1000,
            height: 382,
          });
        } else {
          chrome.tabs.create(settings_tab, function(tab) {
            ExtSessionStorage.set({translatorTab: tab.id});
          });
        }
      })
      .catch(err => {
        console.error('Error handling translation click', err);
      });
}

function createMenus(options: Options): Promise<void> {
  chrome.contextMenus.removeAll();

  let contextMenuLangs: ContextMenuLangs = {};
  let langs = options.targetLangs;
  let isSingleEntry = Object.values(langs).length == 1;

  let parentEl;
  if (!isSingleEntry) {
    parentEl = chrome.contextMenus.create({
      'id': 'parent',
      'title': chrome.i18n.getMessage('contextmenu_title'),
      'contexts': ['selection']
    });
  }

  for (let [index, language] of Object.entries(langs)) {
    let languageDetails = isoLangs[language];
    if (languageDetails === undefined) {
      console.error(language + ' doesn\'t exist!');
      continue;
    }
    let title;
    if (isSingleEntry) {
      title =
          chrome.i18n.getMessage('contextmenu_title2', languageDetails.name);
    } else {
      title = languageDetails.name + ' (' + languageDetails.nativeName + ')';
    }
    let id = chrome.contextMenus.create({
      'id': 'tr_language_' + language,
      'title': title,
      'parentId': parentEl,
      'contexts': ['selection']
    });
    contextMenuLangs[id] = language;
  }

  if (!isSingleEntry) {
    chrome.contextMenus.create({
      'id': 'tr_separator',
      'type': 'separator',
      'parentId': parentEl,
      'contexts': ['selection']
    });
    chrome.contextMenus.create({
      'id': 'tr_options',
      'title': chrome.i18n.getMessage('contextmenu_edit'),
      'parentId': parentEl,
      'contexts': ['selection']
    });
  }

  return ExtSessionStorage.set({contextMenuLangs});
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName == 'sync') {
    Options.getOptions(/* readOnly = */ false)
        .then(options => {
          return createMenus(options);
        })
        .catch(err => {
          console.error(
              'Error setting up the extension after a change ' +
                  'in the storage area.',
              err);
        });
  }
});

Options.getOptions(/* readOnly = */ false)
    .then(options => {
      if (options.isFirstRun) {
        chrome.notifications.create('install', {
          type: 'basic',
          iconUrl: 'icons/translate-128.png',
          title: chrome.i18n.getMessage('notification_install_title'),
          message: chrome.i18n.getMessage('notification_install_message'),
          isClickable: true
        });
      }

      return createMenus(options);
    })
    .catch(err => {
      console.error('Error initializing the extension.', err);
    });

chrome.notifications.onClicked.addListener(notification_id => {
  switch (notification_id) {
    case 'install':
      chrome.runtime.openOptionsPage();
      break;
  }
  chrome.notifications.clear(notification_id);
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == 'tr_options') {
    chrome.runtime.openOptionsPage();
  } else {
    translationClick(info, tab);
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  ExtSessionStorage.get('translatorTab')
      .then(items => {
        if (tabId == items.translatorTab) {
          ExtSessionStorage.set({translatorTab: null});
        }
      })
      .catch(err => console.log(err));
});

actionApi.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'clearTranslatorTab':
      ExtSessionStorage.set({translatorTab: null});
      break;

    default:
      console.error(`Unknown action "${request.action}" received as a message.`);
  }

  return undefined;
});
