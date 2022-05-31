import {convertLanguages, isoLangs} from './consts';

type TabOptionValue = ''|'yep'|'popup';
type DeprecatedTabOptionValue = 'panel';
type TabOptionValueIncludingDeprecated =
    TabOptionValue|DeprecatedTabOptionValue;

interface TabOption {
  value: TabOptionValue;
  labelMsg: string;
  deprecatedValues: TabOptionValueIncludingDeprecated[];
}

interface TargetLangs {
  [key: string]: string;  // Here the key is a string with a number.
}
interface OptionsV0 {
  translateinto: TargetLangs;
  uniquetab: TabOptionValue;
}

interface LegacyLanguages {
  [key: string]: string;  // Here the key is a string with the language code.
}
/**
 * Backwards-compatible interface for the information available in the sync
 * storage area.
 */
interface LegacyOptions {
  translateinto: TargetLangs;
  languages: LegacyLanguages;
  uniquetab: TabOptionValueIncludingDeprecated;
}

interface OptionsWrapper {
  options: OptionsV0;
  isFirstRun: boolean;
}

export const TAB_OPTIONS: TabOption[] = [
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
  _options: OptionsV0;
  isFirstRun: boolean;

  constructor(options: OptionsV0, isFirstRun: boolean) {
    this._options = options;
    this.isFirstRun = isFirstRun;
  }

  get uniqueTab(): TabOptionValue {
    return this._options.uniquetab;
  }

  get targetLangs(): TargetLangs {
    return this._options.translateinto;
  }

  // Returns a promise that resolves in an instance of the Object class with the
  // current options.
  static getOptions(readOnly: boolean = true): Promise<Options> {
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
  static getOptionsRaw(readOnly: boolean): Promise<OptionsWrapper> {
    return new Promise((res, rej) => {
      chrome.storage.sync.get(null, itemsAny => {
        if (chrome.runtime.lastError) {
          return rej(chrome.runtime.lastError);
        }

        let items = <LegacyOptions>itemsAny;
        let didTranslateintoChange = false;
        let didUniquetabChange = false;

        // If the extension sync storage area is blank, set this as being the
        // first run.
        let isFirstRun = Object.keys(items).length === 0;

        // Create |translateinto| property if it doesn't exist.
        if (items.translateinto === undefined) {
          didTranslateintoChange = true;

          // Upgrade from a version previous to v0.7 if applicable, otherwise
          // create the property with the default values.
          if (items.languages !== undefined) {
            let newTranslateinto: TargetLangs;
            items.translateinto =
                Object.assign(newTranslateinto, Object.values(items.languages));
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
        let uniquetabNewValue: TabOptionValue;
        let foundValue = false;
        for (let opt of TAB_OPTIONS) {
          if (opt.value == items?.uniquetab) {
            uniquetabNewValue = opt.value;
            foundValue = true;
            break;
          }
          if (opt.deprecatedValues.includes(items?.uniquetab)) {
            foundValue = true;
            uniquetabNewValue = opt.value;
            break;
          }
        }
        if (!foundValue) {
          uniquetabNewValue = 'popup';
          didUniquetabChange = true;
        }

        // Clean up deprecated properties
        if (items.languages !== undefined) {
          delete items.languages;
          chrome.storage.sync.remove('languages');
        }

        let returnObject: OptionsWrapper = {
          isFirstRun,
          options: {
            translateinto: items.translateinto,
            uniquetab: uniquetabNewValue,
          }
        };

        // Save properties that have changed if we're not in read-only mode
        if (!readOnly) {
          if (didTranslateintoChange || didUniquetabChange) {
            chrome.storage.sync.set(returnObject.options);
          }
        }

        res(returnObject);
      });
    });
  }
}
