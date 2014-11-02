var isoLangs = {"af":{"name":"Afrikaans","nativeName":"Afrikaans"},"sq":{"name":"Albanian","nativeName":"Shqip"},"ar":{"name":"Arabic","nativeName":"\u0639\u0631\u0628\u064a"},"hy":{"name":"Armenian","nativeName":"\u0540\u0561\u0575\u0565\u0580\u0567\u0576"},"az":{"name":"Azerbaijani","nativeName":"\u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646 \u062f\u06cc\u0644\u06cc"},"eu":{"name":"Basque","nativeName":"Euskara"},"be":{"name":"Belarusian","nativeName":"\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f"},"bg":{"name":"Bulgarian","nativeName":"\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438"},"ca":{"name":"Catalan","nativeName":"Catal\u00e0"},"zh-CN":{"name":"Chinese (Simplified)","nativeName":"\u4e2d\u6587\u7b80\u4f53"},"zh-TW":{"name":"Chinese (Traditional)","nativeName":"\u4e2d\u6587\u7e41\u9ad4"},"hr":{"name":"Croatian","nativeName":"Hrvatski"},"cs":{"name":"Czech","nativeName":"\u010ce\u0161tina"},"da":{"name":"Danish","nativeName":"Dansk"},"nl":{"name":"Dutch","nativeName":"Nederlands"},"en":{"name":"English","nativeName":"English"},"et":{"name":"Estonian","nativeName":"Eesti keel"},"tl":{"name":"Filipino","nativeName":"Filipino"},"fi":{"name":"Finnish","nativeName":"Suomi"},"fr":{"name":"French","nativeName":"Fran\u00e7ais"},"gl":{"name":"Galician","nativeName":"Galego"},"ka":{"name":"Georgian","nativeName":"\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8"},"de":{"name":"German","nativeName":"Deutsch"},"el":{"name":"Greek","nativeName":"\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac"},"ht":{"name":"Haitian Creole","nativeName":"Krey\u00f2l ayisyen"},"iw":{"name":"Hebrew","nativeName":"\u05e2\u05d1\u05e8\u05d9\u05ea"},"hi":{"name":"Hindi","nativeName":"\u0939\u093f\u0928\u094d\u0926\u0940"},"hu":{"name":"Hungarian","nativeName":"Magyar"},"is":{"name":"Icelandic","nativeName":"\u00cdslenska"},"id":{"name":"Indonesian","nativeName":"Bahasa Indonesia"},"ga":{"name":"Irish","nativeName":"Gaeilge"},"it":{"name":"Italian","nativeName":"Italiano"},"ja":{"name":"Japanese","nativeName":"\u65e5\u672c\u8a9e"},"ko":{"name":"Korean","nativeName":"\ud55c\uad6d\uc5b4"},"lv":{"name":"Latvian","nativeName":"Latvie\u0161u"},"lt":{"name":"Lithuanian","nativeName":"Lietuvi\u0173 kalba"},"mk":{"name":"Macedonian","nativeName":"\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438"},"ms":{"name":"Malay","nativeName":"Malay"},"mt":{"name":"Maltese","nativeName":"Malti"},"no":{"name":"Norwegian","nativeName":"Norsk"},"fa":{"name":"Persian","nativeName":"\u0641\u0627\u0631\u0633\u06cc"},"pl":{"name":"Polish","nativeName":"Polski"},"pt":{"name":"Portuguese","nativeName":"Portugu\u00eas"},"ro":{"name":"Romanian","nativeName":"Rom\u00e2n\u0103"},"ru":{"name":"Russian","nativeName":"\u0420\u0443\u0441\u0441\u043a\u0438\u0439"},"sr":{"name":"Serbian","nativeName":"\u0421\u0440\u043f\u0441\u043a\u0438"},"sk":{"name":"Slovak","nativeName":"Sloven\u010dina"},"sl":{"name":"Slovenian","nativeName":"Slovensko"},"es":{"name":"Spanish","nativeName":"Espa\u00f1ol"},"sw":{"name":"Swahili","nativeName":"Kiswahili"},"sv":{"name":"Swedish","nativeName":"Svenska"},"th":{"name":"Thai","nativeName":"\u0e44\u0e17\u0e22"},"tr":{"name":"Turkish","nativeName":"T\u00fcrk\u00e7e"},"uk":{"name":"Ukrainian","nativeName":"\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430"},"ur":{"name":"Urdu","nativeName":"\u0627\u0631\u062f\u0648"},"vi":{"name":"Vietnamese","nativeName":"Ti\u1ebfng Vi\u1ec7t"},"cy":{"name":"Welsh","nativeName":"Cymraeg"},"yi":{"name":"Yiddish","nativeName":"\u05d9\u05d9\u05b4\u05d3\u05d9\u05e9"}};


var array_elements = new Array(), translator_tab = false, translator_window = false;

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function click(info, tab) {
	chrome.storage.sync.get("uniquetab", function(items) {
		var settings_tab = {'url': 'https://translate.google.com/#auto/'+array_elements[info.menuItemId]['langCode']+'/'+encodeURIComponent(info.selectionText)};
		if (translator_tab && items.uniquetab == "yep") {
			chrome.tabs.update(translator_tab, settings_tab, function(tab){
				chrome.tabs.highlight({'windowId': tab.windowId, 'tabs': tab.index}, function() {
					chrome.windows.update(tab.windowId, {focused: true}, function() {});
				});
			});
		} else if (items.uniquetab == "panel") {
			chrome.windows.create({
				type: 'panel', url: 'https://translate.google.com/#auto/'+array_elements[info.menuItemId]['langCode']+'/'+encodeURIComponent(info.selectionText), width: 1000, height: 382}, function(tab) {
					translator_window = tab.windowId;
					translator_tab = tab.id;
					chrome.windows.onRemoved.addListener(function (windowId) {
						if (windowId == translator_window) {
							translator_window = false;
							translator_tab = false;
						}
					});
				}
			);
		} else {
			chrome.tabs.create(settings_tab, function(tab) {
				translator_window = tab.windowId;
				translator_tab = tab.id;
				chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
					if (tabId == translator_tab) {
						translator_window = false;
						translator_tab = false;
					}
				});
			});
		}
	});
}

function click2(info, tab) {
	chrome.tabs.create({'url': 'chrome-extension://'+chrome.i18n.getMessage("@@extension_id")+'/options.html', 'active': true}, function(tab) {
		chrome.windows.update(tab.windowId, {'focused': true}, function() {});
	});

}

function createmenus() {
	chrome.storage.sync.get("languages", function(items) {
		chrome.contextMenus.removeAll();

		var count = 0, singleone = true;

		for (var language in items.languages) {
			if (count == 0) {
				count++;
			} else {
				singleone = false;
				break;
			}
		}

		if (singleone) {
			for (var language in items.languages) {
				var languagem = isoLangs[language];
				var title = languagem.name + " ("+languagem.nativeName+")";
				var parent = chrome.contextMenus.create({"title": chrome.i18n.getMessage("contextmenu_title2", languagem.name), "contexts": ["selection"], "onclick": click});
				array_elements[parent] = new Array();
				array_elements[parent]["langCode"] = language;
				array_elements[parent]["langName"] = languagem.name;
				array_elements[parent]["langNativeName"] = language.nativeName;
			}
		} else {
			var parent = chrome.contextMenus.create({"title": chrome.i18n.getMessage("contextmenu_title"), "contexts": ["selection"]});
			for (var language in items.languages) {
				var languagem = isoLangs[language];
				var title = languagem.name + " ("+languagem.nativeName+")";
				var id = chrome.contextMenus.create({"title": title, "parentId": parent, "contexts":["selection"], "onclick": click});
				array_elements[id] = new Array();
				array_elements[id]["langCode"] = language;
				array_elements[id]["langName"] = languagem.name;
				array_elements[id]["langNativeName"] = language.nativeName;
			}
			var id = chrome.contextMenus.create({"type": "separator","parentId": parent, "contexts":["selection"], "onclick": click2});
			var id = chrome.contextMenus.create({"title": chrome.i18n.getMessage("contextmenu_edit"), "parentId": parent, "contexts":["selection"], "onclick": click2});
		}
	});
}

chrome.runtime.onInstalled.addListener(function(details) {
	chrome.storage.sync.get(null, function(items) {
		if (details.reason == "install") {
			if (isEmpty(items)) {
				var settings = {'languages': {}, 'uniquetab': ''}, default_language = chrome.i18n.getMessage("@@ui_locale").split("_")[0];
				if (isoLangs[default_language] != "undefined") {
					settings.languages[default_language] = default_language;
				}
				chrome.storage.sync.set(settings, function() {
					chrome.notifications.create("install", {
						type: "basic",
						iconUrl: "translate-128.png",
						title: chrome.i18n.getMessage("notification_install_title"),
						message: chrome.i18n.getMessage("notification_install_message"),
						isClickable: true
					}, function(id) {});
				});
			}
		}
		if (details.reason == "update") {
			var version = details.previousVersion.split(".");
			if (version[0] == "0" && version[1] < "6") {
				var settings = {'languages': {}, 'uniquetab': ''}, default_language = chrome.i18n.getMessage("@@ui_locale").split("_")[0];
				if (isoLangs[default_language] != "undefined") {
					settings.languages[default_language] = default_language;
				}
				chrome.storage.sync.set(settings, function() {
					chrome.notifications.create("upgradedtostorage", {
						type: "basic",
						iconUrl: "translate-128.png",
						title: chrome.i18n.getMessage("notification_upgradedtostorage_title"),
						message: chrome.i18n.getMessage("notification_upgradedtostorage_message"),
						isClickable: true
					}, function(id) {});
				});
			}
		}
	});
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
	if (areaName == "sync")
		createmenus();
});

chrome.storage.sync.get(null, function(items) {
	if (items.languages) {
		createmenus();
	} else {
		chrome.contextMenus.removeAll();
		var parent = chrome.contextMenus.create({"title": chrome.i18n.getMessage("contextmenu_title"), "contexts":["selection"]});
		var id = chrome.contextMenus.create({"title": chrome.i18n.getMessage("contextmenu_edit"), "parentId": parent, "contexts":["selection"], "onclick": click2});
	}
});

chrome.notifications.onClicked.addListener(function(notification_id) {
	switch(notification_id) {
		case "install":
		click2();
		break;

		case "upgradedtostorage":
		click2();
		break;
	}
	chrome.notifications.clear(notification_id, function() {

	});
});