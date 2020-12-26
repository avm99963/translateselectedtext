var array_elements = [], translator_tab = null, translator_window = null;

function isEmpty(obj) {
	return Object.keys(obj).length === 0;
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
	console.log(info.selectionText);
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
		} else if (items.uniquetab == 'panel') {
			chrome.windows.create(
			    {
				    type: 'panel',
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
				var settings = {'translateinto': {}, 'uniquetab': ''},
				    default_language =
				        chrome.i18n.getMessage('@@ui_locale').split('_')[0];

				if (isoLangs[default_language] != 'undefined') {
					settings.translateinto[default_language] = default_language;
				}

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

				if (isoLangs[default_language] != 'undefined')
					settings.languages[default_language] = default_language;

				chrome.storage.sync.set(settings, function() {
					chrome.notifications.create('upgradedtostorage', {
						type: 'basic',
						iconUrl: 'icons/translate-128.png',
						title:
						    chrome.i18n.getMessage('notification_upgradedtostorage_title'),
						message: chrome.i18n.getMessage(
						    'notification_upgradedtostorage_message'),
						isClickable: true,
					});
				});
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
				chrome.storage.sync.set(items, _ => {
					chrome.notifications.create('reorder', {
						type: 'basic',
						iconUrl: 'icons/translate-128.png',
						title: chrome.i18n.getMessage('notification_reorder_title'),
						message: chrome.i18n.getMessage('notification_reorder_message'),
						isClickable: true
					});
				});
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
		case 'upgradedtostorage':
		case 'reorder':
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
