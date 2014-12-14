var isoLangs = {"af":{"name":"Afrikaans","nativeName":"Afrikaans"},"sq":{"name":"Albanian","nativeName":"Shqip"},"ar":{"name":"Arabic","nativeName":"\u0639\u0631\u0628\u064a"},"hy":{"name":"Armenian","nativeName":"\u0540\u0561\u0575\u0565\u0580\u0567\u0576"},"az":{"name":"Azerbaijani","nativeName":"\u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646 \u062f\u06cc\u0644\u06cc"},"eu":{"name":"Basque","nativeName":"Euskara"},"be":{"name":"Belarusian","nativeName":"\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f"},"bg":{"name":"Bulgarian","nativeName":"\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438"},"ca":{"name":"Catalan","nativeName":"Catal\u00e0"},"ny":{"name":"Chichewa","nativeName":"chiChe\u0175a"},"zh-CN":{"name":"Chinese (Simplified)","nativeName":"\u4e2d\u6587\u7b80\u4f53"},"zh-TW":{"name":"Chinese (Traditional)","nativeName":"\u4e2d\u6587\u7e41\u9ad4"},"hr":{"name":"Croatian","nativeName":"Hrvatski"},"cs":{"name":"Czech","nativeName":"\u010ce\u0161tina"},"da":{"name":"Danish","nativeName":"Dansk"},"nl":{"name":"Dutch","nativeName":"Nederlands"},"en":{"name":"English","nativeName":"English"},"et":{"name":"Estonian","nativeName":"Eesti keel"},"tl":{"name":"Filipino","nativeName":"Filipino"},"fi":{"name":"Finnish","nativeName":"Suomi"},"fr":{"name":"French","nativeName":"Fran\u00e7ais"},"gl":{"name":"Galician","nativeName":"Galego"},"ka":{"name":"Georgian","nativeName":"\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8"},"de":{"name":"German","nativeName":"Deutsch"},"el":{"name":"Greek","nativeName":"\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac"},"ht":{"name":"Haitian Creole","nativeName":"Krey\u00f2l ayisyen"},"iw":{"name":"Hebrew","nativeName":"\u05e2\u05d1\u05e8\u05d9\u05ea"},"hi":{"name":"Hindi","nativeName":"\u0939\u093f\u0928\u094d\u0926\u0940"},"hu":{"name":"Hungarian","nativeName":"Magyar"},"is":{"name":"Icelandic","nativeName":"\u00cdslenska"},"id":{"name":"Indonesian","nativeName":"Bahasa Indonesia"},"ga":{"name":"Irish","nativeName":"Gaeilge"},"it":{"name":"Italian","nativeName":"Italiano"},"ja":{"name":"Japanese","nativeName":"\u65e5\u672c\u8a9e"},"kk":{"name":"Kazakh","nativeName":"\u049a\u0430\u0437\u0430\u049b \u0442\u0456\u043b\u0456"},"ko":{"name":"Korean","nativeName":"\ud55c\uad6d\uc5b4"},"lv":{"name":"Latvian","nativeName":"Latvie\u0161u"},"lt":{"name":"Lithuanian","nativeName":"Lietuvi\u0173 kalba"},"mk":{"name":"Macedonian","nativeName":"\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438"},"mg":{"name":"Malagasy","nativeName":"Malagasy fiteny"},"ms":{"name":"Malay","nativeName":"Malay"},"ml":{"name":"Malayalam","nativeName":"\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02"},"mt":{"name":"Maltese","nativeName":"Malti"},"my":{"name":"Myanmar (Burmese)","nativeName":"\u1017\u1019\u102c\u1005\u102c"},"no":{"name":"Norwegian","nativeName":"Norsk"},"fa":{"name":"Persian","nativeName":"\u0641\u0627\u0631\u0633\u06cc"},"pl":{"name":"Polish","nativeName":"Polski"},"pt":{"name":"Portuguese","nativeName":"Portugu\u00eas"},"ro":{"name":"Romanian","nativeName":"Rom\u00e2n\u0103"},"ru":{"name":"Russian","nativeName":"\u0420\u0443\u0441\u0441\u043a\u0438\u0439"},"sr":{"name":"Serbian","nativeName":"\u0421\u0440\u043f\u0441\u043a\u0438"},"st":{"name":"Sesotho","nativeName":"Sesotho"},"si":{"name":"Sinhala","nativeName":"\u0dc3\u0dd2\u0d82\u0dc4\u0dbd"},"sk":{"name":"Slovak","nativeName":"Sloven\u010dina"},"sl":{"name":"Slovenian","nativeName":"Slovensko"},"es":{"name":"Spanish","nativeName":"Espa\u00f1ol"},"su":{"name":"Sundanese","nativeName":"Basa Sunda"},"sw":{"name":"Swahili","nativeName":"Kiswahili"},"sv":{"name":"Swedish","nativeName":"Svenska"},"tg":{"name":"Tajik","nativeName":"\u0442\u043e\u04b7\u0438\u043a\u04e3"},"th":{"name":"Thai","nativeName":"\u0e44\u0e17\u0e22"},"tr":{"name":"Turkish","nativeName":"T\u00fcrk\u00e7e"},"uk":{"name":"Ukrainian","nativeName":"\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430"},"ur":{"name":"Urdu","nativeName":"\u0627\u0631\u062f\u0648"},"uz":{"name":"Uzbek","nativeName":"zbek"},"vi":{"name":"Vietnamese","nativeName":"Ti\u1ebfng Vi\u1ec7t"},"cy":{"name":"Welsh","nativeName":"Cymraeg"},"yi":{"name":"Yiddish","nativeName":"\u05d9\u05d9\u05b4\u05d3\u05d9\u05e9"}}, sortable;

function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return document.querySelectorAll(selector);
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function i18n() {
    $("#welcome").innerHTML = chrome.i18n.getMessage("options_welcome");
    $("#introduction").innerHTML = chrome.i18n.getMessage("options_introduction");
    //$("#languageselectheader").innerHTML = chrome.i18n.getMessage("options_languageselectheader");
    $("#otheroptionsheader").innerHTML = chrome.i18n.getMessage("options_otheroptionsheader");
    $("#varioustabs_label").innerHTML = chrome.i18n.getMessage("options_tabsoption_1");
    $("#uniquetab_label").innerHTML = chrome.i18n.getMessage("options_tabsoption_2");
    $("#panel_label").innerHTML = chrome.i18n.getMessage("options_tabsoption_3");
    $("#languages_add").innerHTML = chrome.i18n.getMessage("options_addlanguage_addbutton");
    $("#save").innerHTML = chrome.i18n.getMessage("options_savebutton");
    $("#credits").innerHTML = chrome.i18n.getMessage("options_credits");
    $("#credits_dialog h3").innerHTML = chrome.i18n.getMessage("options_credits");
    $("#languages_add_ok").innerHTML = chrome.i18n.getMessage("options_ok");
    $("#languages_add_cancel").innerHTML = chrome.i18n.getMessage("options_cancel");
    $("#credits_ok").innerHTML = chrome.i18n.getMessage("options_ok");
    $("#languages_add_dialog h3").innerHTML = chrome.i18n.getMessage("options_addlanguage");
    $("#language_label").innerHTML = chrome.i18n.getMessage("options_language_label");
}

function print_list_modal() {
    $("#select_language").innerHTML = "";
    var heysortable = sortable.toArray();
    for (var language in isoLangs) {
        if (!inArray(language, heysortable)) {
            var el = document.createElement('option');
            el.setAttribute('value', language);
            el.innerText = isoLangs[language]["name"]+" ("+isoLangs[language]["nativeName"]+")";
            $("#select_language").appendChild(el);
        }
    }
}

function init() {
    i18n();
    chrome.storage.sync.get(null, function(items) {
        // If no settings are set
        if (isEmpty(items)) {
            items = {'translateinto': {}, 'uniquetab': ''};
            chrome.storage.sync.set({'translateinto': {}, 'uniquetab': ''});
        }

        // Check the checkbox of the window opening
        if (items.uniquetab === "yep")
            $("#uniquetab").checked = true;
        if (items.uniquetab === "")
            $("#varioustabs").checked = true;
        if (items.uniquetab === "panel")
            $("#panel").checked = true;

        // Add event listeners for certain buttons and links
        $("#panelsflag").addEventListener('click', function() { event.preventDefault(); chrome.tabs.create({url: 'chrome://flags/#enable-panels'}); });
        $("#save").addEventListener('click', function() {
            save_options();
        });

        // Print selected language list
        var languages = items.translateinto;

        if (languages) {
            for (var language_id in languages) {
                var language = languages[language_id];
                var el = document.createElement('li');
                el.setAttribute('data-language', language);
                el.setAttribute('data-id', language);
                el.innerHTML = isoLangs[language]["name"]+" ("+isoLangs[language]["nativeName"]+")"+"<span data-language='"+language+"' class='delete'>x</span>";
                $("#languages").appendChild(el);
                $("#languages li[data-language="+language+"] .delete").addEventListener('click', function() {
                    $("#languages").removeChild($("li[data-language="+this.getAttribute("data-language")+"]"));
                    print_list_modal();
                });
            }
        }

        // Initiate Sortable
        sortable = new Sortable($("#languages"), {
            animation: 150
        });

        // Handling The Dialog
        $("#languages_add").addEventListener('click', function() { $("dialog#languages_add_dialog").showModal(); $("#select_language").focus(); });
        $("#languages_add_cancel").addEventListener('click', function() { $("dialog#languages_add_dialog").close(); });
        $("#languages_add_ok").addEventListener('click', function() {
            var el = document.createElement('li');
            var language = $("#select_language").value;
            if (inArray(language, sortable.toArray())) {
                return;
            }
            el.setAttribute('data-language', language);
            el.setAttribute('data-id', language);
            el.innerHTML = isoLangs[language]["name"]+" ("+isoLangs[language]["nativeName"]+")"+"<span data-language='"+language+"' class='delete'>x</span>";
            $("#languages").appendChild(el);
            var selection = $("#select_language option[value="+language+"]");
            selection.parentNode.removeChild(selection);
            $("#languages li[data-id="+language+"] .delete").addEventListener('click', function() {
                $("#languages").removeChild($("li[data-language="+this.getAttribute("data-language")+"]"));
                print_list_modal();
            });
            $("dialog").close();
        });

        // About credits...
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var json = JSON.parse(xhr.responseText), printhtml = "";
                for (var item in json) {
                    printhtml += "<div>";
                    if (json[item].url) {
                        printhtml += "<a href='"+json[item].url+"' class='homepage' target='_blank'>"+chrome.i18n.getMessage("options_credits_homepage")+"</a>";
                    }
                    printhtml += "<h4>"+json[item].name+"</h4>";
                    if (json[item].author) {
                        printhtml += "<p class='author'>"+chrome.i18n.getMessage("options_credits_by")+" "+json[item].author;
                    }
                    if (json[item].license) {
                        printhtml += " – "+json[item].license+"</p>";
                    } else {
                        printhtml += "</p>";
                    }
                    printhtml += "</div>";
                }
                $("dialog#credits_dialog .content_area").innerHTML = printhtml;
                window.onhashchange = function() {
                    if (location.hash == "#credits") {
                        $("dialog#credits_dialog").showModal();
                        $("#credits_ok").focus();
                    }
                }
                if (location.hash == "#credits") {
                    $("dialog#credits_dialog").showModal();
                    $("#credits_ok").focus();
                }
                $("#credits_ok").addEventListener('click', function() { $("dialog#credits_dialog").close(); });
                $("dialog#credits_dialog").addEventListener('close', function() { history.pushState("", document.title, window.location.pathname + window.location.search); });
            }
        }
        xhr.open("GET", "json/credits.json", true);
        xhr.send();

        // Print language list in the modal dialog
        print_list_modal();
    });
}

function save_options() {
    var languages = document.getElementById("languages");
    var options = {"uniquetab": "", "translateinto": {}};

    options.uniquetab = radio_selected("uniquetab");

    var selected_languages = sortable.toArray();

    var i = 0;
    for (var language_id in selected_languages) {
        var language = selected_languages[language_id];
        options.translateinto[i] = language;
        i++;
    }

    chrome.storage.sync.set(options, function() {
        var background = chrome.extension.getBackgroundPage();

        background.translator_tab = false;
        background.translator_window = false;
        window.close();
    });

    // We don't need the following code because the background.js is already listening to changes in chrome.sync ;-) Yeeey!
    //chrome.extension.getBackgroundPage().createmenus(JSON.stringify(options));
}

function toObject(arr) {
    var rv = {};
    for (var i = 0; i < arr.length; ++i)
        if (arr[i] !== undefined) rv[i] = arr[i];
    return rv;
}

function radio_selected(a) {
    var elements = document.getElementsByName(a);

    for (var i=0; i<elements.length; i++)
        if (elements[i].checked) return elements[i].value;
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

window.addEventListener('load', init);
