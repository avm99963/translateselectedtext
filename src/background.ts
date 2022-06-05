import actionApi from './common/actionApi';
import {isoLangs} from './common/consts';
import Options from './common/options';
import ExtSessionStorage from './common/sessionStorage';
import URLFactory from './common/urlFactory';

type NonEmptyArray<T> = [T, ...T[]];

// Data types that the extension can translate.
export enum DataType {
  DataTypeText,
  DataTypeURL,
}

// Information about a context menu item which we have added to the browser.
interface MenuItemInfo {
  language: string;    // Target language displayed in the item.
  dataType: DataType;  // Data type handled by the context menu item.
}

// Object with the context menu items that have been added by the extension and
// information about them.
interface ContextMenuItems {
  [id: string]: MenuItemInfo;
}

// Definition of the types of context menu items that the extension can inject.
interface MenuItemType {
  // Type of data which can be translated with this type of context menu items.
  dataType: DataType;
  // Contexts in which this type of context menu item will be shown.
  contexts: NonEmptyArray<chrome.contextMenus.ContextType>;
  // Prefix of the i18n messages for this type of context menu item, and used to
  // generate the unique IDs of context menu items.
  prefix: string;
}
type MenuItemTypes = MenuItemType[];

const MENU_ITEM_TYPES: MenuItemTypes = [
  {
    dataType: DataType.DataTypeText,
    contexts: ['selection'],
    prefix: '',
  },
  /*
   * @TODO(https://iavm.xyz/b/translateselectedtext/7): Delete this compile-time
   * directive after the experimentation phase is done to launch the feature.
   * #!if canary || !production
   */
  {
    dataType: DataType.DataTypeURL,
    contexts: ['link'],
    prefix: 'link',
  },
  // #!endif
];

function translationClick(
    info: chrome.contextMenus.OnClickData,
    initiatorTab: chrome.tabs.Tab): void {
  const optionsPromise = Options.getOptions();
  const ssPromise =
      ExtSessionStorage.get(['contextMenuItems', 'translatorTab']);
  Promise.all([optionsPromise, ssPromise])
      .then(returnValues => {
        const [options, sessionStorageItems] = returnValues;
        const contextMenuItems: ContextMenuItems =
            sessionStorageItems.contextMenuItems;
        const contextMenuItem = contextMenuItems?.[info.menuItemId];
        const translatorTab: number = sessionStorageItems.translatorTab;

        const url = URLFactory.getTranslationURL(
            contextMenuItem?.language, info, contextMenuItem?.dataType);
        const newTabOptions: Parameters<typeof chrome.tabs.create>[0] = {
          url,
          openerTabId: initiatorTab.id,
        };
        if (initiatorTab.index) newTabOptions.index = initiatorTab.index + 1;

        if (contextMenuItem?.dataType !== DataType.DataTypeText) {
          // Always create a simple new tab for data types other than text.
          // @TODO(https://iavm.xyz/b/translateselectedtext/7): Review this
          // behavior in the future.
          chrome.tabs.create(newTabOptions);
        } else if (translatorTab && options.uniqueTab == 'yep') {
          chrome.tabs.update(translatorTab, {url}, tab => {
            chrome.tabs.highlight(
                {windowId: tab.windowId, tabs: tab.index}, () => {
                  chrome.windows.update(tab.windowId, {focused: true});
                });
          });
        } else if (options.uniqueTab == 'popup') {
          chrome.windows.create({type: 'popup', url, width: 1000, height: 382});
        } else {
          chrome.tabs.create(newTabOptions, tab => {
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

  const contextMenuItems: ContextMenuItems = {};
  const langs = options.targetLangs;
  const isSingleEntry = Object.values(langs).length == 1;

  for (const type of MENU_ITEM_TYPES) {
    let parentEl;
    if (!isSingleEntry) {
      parentEl = chrome.contextMenus.create({
        'id': `${type.prefix}parent`,
        'title': chrome.i18n.getMessage(`contextmenu${type.prefix}_title`),
        'contexts': type.contexts,
      });
    }

    for (const language of Object.values(langs)) {
      const languageDetails = isoLangs[language];
      if (languageDetails === undefined) {
        console.error(language + ' doesn\'t exist!');
        continue;
      }
      let title;
      if (isSingleEntry) {
        title = chrome.i18n.getMessage(
            `contextmenu${type.prefix}_title2`, languageDetails.name);
      } else {
        title = languageDetails.name + ' (' + languageDetails.nativeName + ')';
      }
      const id = chrome.contextMenus.create({
        'id': `${type.prefix}tr_language_${language}`,
        'title': title,
        'parentId': parentEl,
        'contexts': type.contexts,
      });
      contextMenuItems[id] = {
        language,
        dataType: type.dataType,
      };
    }

    if (!isSingleEntry) {
      chrome.contextMenus.create({
        'id': `${type.prefix}tr_separator`,
        'type': 'separator',
        'parentId': parentEl,
        'contexts': type.contexts,
      });
      chrome.contextMenus.create({
        'id': `${type.prefix}tr_options`,
        'title': chrome.i18n.getMessage('contextmenu_edit'),
        'parentId': parentEl,
        'contexts': type.contexts,
      });
    }
  }

  return ExtSessionStorage.set({contextMenuItems});
}

chrome.storage.onChanged.addListener((_changes, areaName) => {
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
  for (const type of MENU_ITEM_TYPES) {
    if (info.menuItemId == `${type.prefix}tr_options`) {
      chrome.runtime.openOptionsPage();
      return;
    }
  }

  translationClick(info, tab);
});

chrome.tabs.onRemoved.addListener(tabId => {
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

chrome.runtime.onMessage.addListener(request => {
  switch (request.action) {
    case 'clearTranslatorTab':
      ExtSessionStorage.set({translatorTab: null});
      break;

    default:
      console.error(
          `Unknown action "${request.action}" received as a message.`);
  }

  return undefined;
});
