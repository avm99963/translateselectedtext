import {isoLangs} from './common/consts.js';
import Options from './common/options.js';

window.contextMenuLangs = [];
window.translator_tab = null;

function getTranslationUrl(lang, text) {
  var params = new URLSearchParams({
    sl: 'auto',
    tl: lang,
    text: text,
    op: 'translate',
  });
  return 'https://translate.google.com/?' + params.toString();
}

function translationClick(info, tab) {
  Options.getOptions()
      .then(options => {
        let url = getTranslationUrl(
            window.contextMenuLangs[info.menuItemId], info.selectionText);
        let settings_tab = {url};
        if (window.translator_tab && options.uniqueTab == 'yep') {
          chrome.tabs.update(window.translator_tab, settings_tab, tab => {
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
            let translator_window = tab.windowId;
            window.translator_tab = tab.id;
          });
        }
      })
      .catch(err => {
        console.error('Error retrieving options to handle translation', err);
      });
}

function createMenus(options) {
  chrome.contextMenus.removeAll();

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
    window.contextMenuLangs[id] = language;
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
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName == 'sync') {
    Options.getOptions(/* readOnly = */ false)
        .then(options => {
          createMenus(options);
        })
        .catch(err => {
          console.error(
              'Error retrieving options to set up the extension after a change ' +
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

      createMenus(options);
    })
    .catch(err => {
      console.error(
          'Error retrieving options to initialize the extension.', err);
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
  if (tabId == window.translator_tab) {
    translator_window = null;
    window.translator_tab = null;
  }
});

chrome.browserAction.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
