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
  $all('[data-i18n]').forEach(el => {
    el.innerHTML =
        chrome.i18n.getMessage('options_' + el.getAttribute('data-i18n'));
  });
}

function printListModal() {
  $('#select_language').textContent = '';
  var heysortable = sortable.toArray();
  var languages = [];
  for (var langCode of Object.keys(isoLangs)) {
    var l = isoLangs[langCode];
    l['code'] = langCode;
    languages.push(l);
  }

  languages.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
  languages.forEach(language => {
    if (!inArray(language['code'], heysortable)) {
      var el = document.createElement('option');
      el.setAttribute('value', language['code']);
      el.textContent = language['name'] + ' (' + language['nativeName'] + ')';
      $('#select_language').appendChild(el);
    }
  });
}

function init() {
  i18n();
  chrome.storage.sync.get(null, items => {
    // If no settings are set
    if (isEmpty(items)) {
      items = {
        translateinto: {},
        uniquetab: 'popup',
      };
      chrome.storage.sync.set(items);
    }

    // Check the checkbox of the window opening
    if (items.uniquetab === 'yep') $('#uniquetab').checked = true;
    if (items.uniquetab === '') $('#varioustabs').checked = true;
    if (items.uniquetab === 'panel' || items.uniquetab === 'popup')
      $('#popup').checked = true;

    // Add event listeners for certain buttons and links
    $('#save').addEventListener('click', _ => {
      saveOptions(true);
    });

    // Save automatically
    $all('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', _ => {
        saveOptions();
      });
    });

    // Print selected language list
    var languages = items.translateinto;

    if (languages) {
      for (var language_id of Object.keys(languages)) {
        var language = languages[language_id];
        var el = document.createElement('li');
        el.setAttribute('data-language', language);
        el.setAttribute('data-id', language);
        el.innerHTML = isoLangs[language]['name'] + ' (' +
            isoLangs[language]['nativeName'] + ')' +
            '<span data-language=\'' + language +
            '\' class=\'delete\'>x</span>';
        $('#languages').appendChild(el);
        $('#languages li[data-language=' + language + '] .delete')
            .addEventListener('click', function() {
              $('#languages')
                  .removeChild($(
                      'li[data-language=' + this.getAttribute('data-language') +
                      ']'));
              printListModal();
              // Save automatically
              saveOptions();
            });
      }
    }

    // Initiate Sortable
    sortable = new Sortable($('#languages'), {animation: 150});

    // Handling The Dialog
    $('#languages_add').addEventListener('click', _ => {
      $('dialog#languages_add_dialog').showModal();
      $('#select_language').focus();
    });

    $('#languages_add_cancel').addEventListener('click', _ => {
      $('dialog#languages_add_dialog').close();
    });

    $('#languages_add_ok').addEventListener('click', _ => {
      var el = document.createElement('li');
      var language = $('#select_language').value;
      if (inArray(language, sortable.toArray())) {
        return;
      }
      el.setAttribute('data-language', language);
      el.setAttribute('data-id', language);
      el.innerHTML = isoLangs[language]['name'] + ' (' +
          isoLangs[language]['nativeName'] + ')' +
          '<span data-language=\'' + language + '\' class=\'delete\'>x</span>';
      $('#languages').appendChild(el);
      var selection = $('#select_language option[value=' + language + ']');
      selection.parentNode.removeChild(selection);
      $('#languages li[data-id=' + language + '] .delete')
          .addEventListener('click', function() {
            $('#languages')
                .removeChild(
                    $('li[data-language=' + this.getAttribute('data-language') +
                      ']'));
            printListModal();
            // Save automatically
            saveOptions();
          });
      $('dialog').close();

      // Save automatically
      saveOptions();
    });

    // About credits...
    var normalCredits = fetch('json/credits.json').then(res => res.json());
    var i18nCredits = fetch('json/i18n-credits.json').then(res => res.json());

    Promise.all([normalCredits, i18nCredits])
        .then(values => {
          var credits = values[0];
          var i18nCredits = values[1];
          var content = $('dialog#credits_dialog .content_area');
          credits.forEach(item => {
            var div = document.createElement('div');
            div.classList.add('entry');
            if (item.url) {
              var a = document.createElement('a');
              a.classList.add('homepage');
              a.href = item.url;
              a.target = '_blank';
              a.textContent =
                  chrome.i18n.getMessage('options_credits_homepage');
              div.append(a);
            }

            var h4 = document.createElement('h4');
            h4.textContent = item.name;
            div.append(h4);

            if (item.author) {
              var p = document.createElement('p');
              p.classList.add('author');
              p.textContent = chrome.i18n.getMessage('options_credits_by') +
                  ' ' + item.author +
                  (item.license ? ' - ' + item.license : '');
              div.append(p);
            }
            content.append(div);
          });

          var cList = document.getElementById('translators');
          i18nCredits.forEach(contributor => {
            var li = document.createElement('li');
            var languages = [];
            if (contributor.languages) {
              contributor.languages.forEach(lang => {
                languages.push(lang.name || 'undefined');
              });
            }

            var name = document.createElement('span');
            name.classList.add('name');
            name.textContent = contributor.name || 'undefined';
            li.append(name);

            if (languages.length > 0) {
              var languages =
                  document.createTextNode(': ' + languages.join(', '));
              li.append(languages);
            }

            cList.append(li);
          });

          window.onhashchange = function() {
            if (location.hash == '#credits') {
              var credits = document.getElementById('credits_dialog');
              credits.showModal();
              credits.querySelector('.scrollable').scrollTo(0, 0);
              $('#credits_ok').focus();
            }
          };

          if (location.hash == '#credits') {
            $('dialog#credits_dialog').showModal();
            $('#credits_ok').focus();
          }

          $('#credits_ok').addEventListener('click', _ => {
            $('dialog#credits_dialog').close();
          });
          $('dialog#credits_dialog').addEventListener('close', _ => {
            history.pushState(
                '', document.title,
                window.location.pathname + window.location.search);
          });

          // Print language list in the modal dialog
          printListModal();
        })
        .catch(err => console.log(err));
  });
}

function saveOptions(close = false) {
  var languages = document.getElementById('languages');
  var options = {
    uniquetab: '',
    translateinto: {},
  };

  options.uniquetab = radioSelected('uniquetab');

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
    if (close) window.close();
  });
}

function radioSelected(a) {
  var elements = document.getElementsByName(a);

  for (var i = 0; i < elements.length; i++)
    if (elements[i].checked) return elements[i].value;
}

function inArray(needle, haystack) {
  var length = haystack.length;
  for (var i = 0; i < length; i++) {
    if (haystack[i] == needle) return true;
  }
  return false;
}

window.addEventListener('load', init);
