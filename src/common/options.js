import {convertLanguages, isoLangs} from './consts.js';

export const TAB_OPTIONS = [
  // Open in new tab for each translation
  {
    value: '',
    labelMsg: 'options_tabsoption_1',
    deprecatedValues: [],
  },
  // Open in a unique tab
  {
    value: 'yep',
    labelMsg: 'options_tabsoption_2',
    deprecatedValues: [],
  },
  // Open in a popup
  {
    value: 'popup',
    labelMsg: 'options_tabsoption_3',
    deprecatedValues: ['panel'],
  },
];

// Class which can be used to retrieve the user options in order to act
// accordingly.
export default class Options {
  constructor(options, isFirstRun) {
    this._options = options;
    this.isFirstRun = isFirstRun;
  }

  get uniqueTab() {
    return this._options.uniquetab;
  }

  get targetLangs() {
    return this._options.translateinto;
  }

  // Returns a promise that resolves in an instance of the Object class with the
  // current options.
  static getOptions(readOnly = true) {
    return Options.getOptionsRaw(readOnly).then(res => {
      return new Options(res.options, res.isFirstRun);
    });
  }

  // Returns a promise that resolves to an object containing:
  // - |options|: normalized options object which can be used to initialize the
  // Options class, and which contains the current options set up by the user.
  // - |isFirstRun|: whether the extension is running for the first time and
  // needs to be set up.
  //
  // If the options needed to be normalized/created, they are also saved in the
  // sync storage area.
  static getOptionsRaw(readOnly) {
    return new Promise((res, rej) => {
      chrome.storage.sync.get(null, items => {
        if (chrome.runtime.lastError) {
          return rej(chrome.runtime.lastError);
        }

        let didTranslateintoChange = false;
        let didUniquetabChange = false;
        let returnObject = {};

        // If the extension sync storage area is blank, set this as being the
        // first run.
        returnObject.isFirstRun = Object.keys(items).length === 0;

        // Create |translateinto| property if it doesn't exist.
        if (items.translateinto === undefined) {
          didTranslateintoChange = true;

          // Upgrade from a version previous to v0.7 if applicable, otherwise
          // create the property with the default values.
          if (items.languages !== undefined) {
            items.translateinto =
                Object.assign({}, Object.values(items.languages));
          } else {
            let uiLocale = chrome.i18n.getMessage('@@ui_locale');
            let defaultLang1 = uiLocale.replace('_', '-');
            let defaultLang2 = uiLocale.split('_')[0];

            items.translateinto = {};
            if (isoLangs[defaultLang1] != undefined)
              items.translateinto['0'] = defaultLang1;
            else if (isoLangs[defaultLang2] != undefined)
              items.translateinto['0'] = defaultLang2;
          }
        }

        // Normalize |translateinto| property: remove non-existent languages or
        // change them with the correct language code.
        for (let [index, language] of Object.entries(items.translateinto)) {
          if (isoLangs[language] === undefined) {
            didTranslateintoChange = true;
            if (convertLanguages[language] === undefined) {
              // The language doesn't exist
              console.log(
                  'Deleting ' + language +
                  ' from items.translateinto because it doesn\'t exist.');
              delete items.translateinto[index];
            } else {
              // The language doesn't exist but a known replacement is known
              let newLanguage = convertLanguages[language];
              console.log('Replacing ' + language + ' with ' + newLanguage);

              // If the converted language is already on the list, just remove
              // the wrong language, otherwise convert the language
              if (Object.values(items.translateinto).includes(newLanguage))
                delete items.translateinto[index];
              else
                items.translateinto[index] = newLanguage;
            }
          }
        }

        // Normalize |uniquetab| property:
        // - If it is set to a valid value, leave it alone.
        // - If it is set to a deprecated value, change it to the corresponding
        // value we use now.
        // - If it is set to an incorrect value or it isn't set, change it to
        // the default value.
        let foundValue = false;
        for (let opt of TAB_OPTIONS) {
          if (opt.value == items?.uniquetab) {
            foundValue = true;
            break;
          }
          if (opt.deprecatedValues.includes(items?.uniquetab)) {
            foundValue = true;
            items.uniquetab = opt.value;
            break;
          }
        }
        if (!foundValue) {
          items.uniquetab = 'popup';
          didUniquetabChange = true;
        }

        // Clean up deprecated properties
        if (items.languages !== undefined) {
          delete items.languages;
          chrome.storage.sync.remove('languages');
        }

        // Save properties that have changed if we're not in read-only mode
        if (!readOnly) {
          if (didTranslateintoChange || didUniquetabChange) {
            chrome.storage.sync.set({
              translateinto: items.translateinto,
              uniquetab: items.uniquetab,
            });
          }
        }

        returnObject.options = items;
        res(returnObject);
      });
    });
  }
}