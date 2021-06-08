var array_elements = [], translator_tab = null, translator_window = null;

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function inObject(hayStack, el) {
  for (var i of Object.keys(hayStack)) {
    if (hayStack[i] == el) return true;
  }
  return false;
}

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
  chrome.storage.sync.get('uniquetab', items => {
    var url = getTranslationUrl(
        array_elements[info.menuItemId]['langCode'], info.selectionText);
    var settings_tab = {url};
    if (translator_tab && items.uniquetab == 'yep') {
      chrome.tabs.update(translator_tab, settings_tab, tab => {
        chrome.tabs.highlight(
            {
              windowId: tab.windowId,
              tabs: tab.index,
            },
            _ => {
              chrome.windows.update(tab.windowId, {
                focused: true,
              });
            });
      });
    } else if (items.uniquetab == 'panel' || items.uniquetab == 'popup') {
      chrome.windows.create(
          {
            type: 'popup',
            url,
            width: 1000,
            height: 382,
          },
          function(tab) {
            translator_window = tab.windowId;
            translator_tab = tab.id;
            chrome.windows.onRemoved.addListener(function(windowId) {
              if (windowId == translator_window) {
                translator_window = null;
                translator_tab = null;
              }
            });
          });
    } else {
      chrome.tabs.create(settings_tab, function(tab) {
        translator_window = tab.windowId;
        translator_tab = tab.id;
        chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
          if (tabId == translator_tab) {
            translator_window = null;
            translator_tab = null;
          }
        });
      });
    }
  });
}

function openOptionsPage() {
  if (chrome.runtime.openOptionsPage) {
    // New way to open options pages, if supported (Chrome 42+).
    chrome.runtime.openOptionsPage();
  } else {
    chrome.tabs.create(
        {
          'url': 'chrome-extension://' +
              chrome.i18n.getMessage('@@extension_id') + '/options.html',
          'active': true
        },
        tab => {
          chrome.windows.update(tab.windowId, {focused: true});
        });
  }
}

function createmenus() {
  chrome.storage.sync.get('translateinto', function(items) {
    chrome.contextMenus.removeAll();

    var count = 0, singleone = true;

    for (var language of Object.keys(items.translateinto)) {
      if (count == 0) {
        count++;
      } else {
        singleone = false;
        break;
      }
    }

    if (singleone) {
      for (var language_id of Object.keys(items.translateinto)) {
        var language = items.translateinto[language_id];
        var languagem = isoLangs[language];
        if (languagem === undefined) {
          console.error(language + ' doesn\'t exist!');
          continue;
        }
        var id = chrome.contextMenus.create({
          'id': 'tr_single_parent',
          'title': chrome.i18n.getMessage('contextmenu_title2', languagem.name),
          'contexts': ['selection'],
        });
        array_elements[id] = new Array();
        array_elements[id]['langCode'] = language;
      }
    } else {
      var parentEl = chrome.contextMenus.create({
        'id': 'parent',
        'title': chrome.i18n.getMessage('contextmenu_title'),
        'contexts': ['selection']
      });
      for (var language_id of Object.keys(items.translateinto)) {
        var language = items.translateinto[language_id];
        var languagem = isoLangs[language];
        if (languagem === undefined) {
          console.error(language + ' doesn\'t exist!');
          continue;
        }
        var title = languagem.name + ' (' + languagem.nativeName + ')';
        var id = chrome.contextMenus.create({
          'id': 'tr_language_' + language,
          'title': title,
          'parentId': parentEl,
          'contexts': ['selection']
        });
        array_elements[id] = new Array();
        array_elements[id]['langCode'] = language;
      }
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
  });
}

chrome.runtime.onInstalled.addListener(function(details) {
  chrome.storage.sync.get(null, function(items) {
    if (details.reason == 'install') {
      if (isEmpty(items)) {
        var settings = {'translateinto': {}, 'uniquetab': 'popup'},
            default_language_1 =
                chrome.i18n.getMessage('@@ui_locale').replace('_', '-'),
            default_language_2 =
                chrome.i18n.getMessage('@@ui_locale').split('_')[0];

        if (isoLangs[default_language_1] != undefined)
          settings.translateinto['0'] = default_language_1;
        else if (isoLangs[default_language_2] != undefined)
          settings.translateinto['0'] = default_language_2;

        chrome.storage.sync.set(settings, function() {
          chrome.notifications.create('install', {
            type: 'basic',
            iconUrl: 'icons/translate-128.png',
            title: chrome.i18n.getMessage('notification_install_title'),
            message: chrome.i18n.getMessage('notification_install_message'),
            isClickable: true
          });
        });
      }
    }
    if (details.reason == 'update') {
      var version = details.previousVersion.split('.');

      // Updating from a version previous to v0.6
      if (version[0] == '0' && version[1] < '6') {
        var settings = {
          languages: {},
          uniquetab: '',
        };
        var default_language =
            chrome.i18n.getMessage('@@ui_locale').split('_')[0];

        if (isoLangs[default_language] != undefined)
          settings.languages[default_language] = default_language;

        chrome.storage.sync.set(settings);
      }

      // Updating from a version previous to v0.7
      if (version[0] == '0' && version[1] < '7') {
        items.translateinto = {};
        var i = 0;
        for (var language in items.languages) {
          items.translateinto[i] = items.languages[language];
          i++;
        }
        delete items.languages;
        chrome.storage.sync.set(items);
      }

      // Remove non-existent languages or change with correct language code
      if (items.translateinto) {
        var modified = false;
        for (var language_id of Object.keys(items.translateinto)) {
          var language = items.translateinto[language_id];
          if (isoLangs[language] === undefined) {
            if (convertLanguages[language] === undefined) {
              // The language doesn't exist
              console.log(
                  'Deleting ' + language +
                  ' from items.translateinto because it doesn\'t exist.');
              delete items.translateinto[language_id];
            } else {
              // The language doesn't exist but a known replacement is known
              var newLanguage = convertLanguages[language];
              console.log('Replacing ' + language + ' with ' + newLanguage);

              // If the converted language is already on the list, just remove
              // the wrong language, otherwise convert the language
              if (inObject(items.translateinto, newLanguage))
                delete items.translateinto[language_id];
              else
                items.translateinto[language_id] = newLanguage;
            }
            modified = true;
          }
        }
        if (modified) chrome.storage.sync.set(items);
      } else {
        console.log('items.translateinto doesn\'t exist: let\'s create it.');
        items['translateinto'] = {};
        chrome.storage.sync.set(items);
      }
    }
  });
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName == 'sync') createmenus();
});

chrome.storage.sync.get(null, items => {
  if (items.translateinto) {
    createmenus();
  } else {
    chrome.contextMenus.removeAll();
    var parent = chrome.contextMenus.create({
      'id': 'tr_parent',
      'title': chrome.i18n.getMessage('contextmenu_title'),
      'contexts': ['selection']
    });
    var id = chrome.contextMenus.create({
      'id': 'tr_options',
      'title': chrome.i18n.getMessage('contextmenu_edit'),
      'parentId': parent,
      'contexts': ['selection']
    });
  }
});

chrome.notifications.onClicked.addListener(notification_id => {
  switch (notification_id) {
    case 'install':
      openOptionsPage();
      break;
  }
  chrome.notifications.clear(notification_id);
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == 'tr_options') {
    openOptionsPage();
  } else {
    translationClick(info, tab);
  }
});

chrome.browserAction.onClicked.addListener(_ => {
  openOptionsPage();
});
