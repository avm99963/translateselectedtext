import {css, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {IsoLang, isoLangs} from '../../../common/consts';
import {msg} from '../../../common/i18n';
import {TargetLangs} from '../../../common/options';
import {DIALOG_STYLES} from '../../shared/dialog-styles';
import {SHARED_STYLES} from '../../shared/shared-styles';

interface IsoLangWCode extends IsoLang {
  code: string;
}

const ALL_LANGUAGES =
    Object.entries(isoLangs)
        .map(entry => {
          const lang: IsoLangWCode = Object.assign(entry[1], {code: entry[0]});
          return lang;
        })
        .sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));

@customElement('add-language-dialog')
export default class AddLanguageDialog extends LitElement {
  static properties = {
    languages: {type: Object},
  };
  @property({type: Object}) languages: TargetLangs;

  static get styles() {
    return [
      SHARED_STYLES,
      DIALOG_STYLES,
      css`
        dialog {
          max-height: 430px;
          width: 430px;
        }

        #language_label {
          font-size: 12px;
        }

        select {
          width: 100%;
        }

        .action_buttons {
          border-top: none;
          padding-top: 0;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.addEventListener('show-add-language-dialog', this.showDialog);
  }

  render() {
    const languageCodes = Object.values(this.languages ?? {});
    const languages = ALL_LANGUAGES
                        .filter(lang => {
                          return !languageCodes.includes(lang.code);
                        })
                        .map(lang => {
                          return html`
          <option value=${lang.code}>
            ${lang?.name} (${lang?.nativeName})
          </option>
        `;
                        });

    return html`
      <dialog>
        <div class="scrollable">
          <h3>${msg('options_addlanguage')}</h3>
          <div class="content_area">
            <label id="language_label" for="select_language">
              ${msg('options_language_label')}
            </label>
            <select id="select_language">${languages}</select>
          </div>
        </div>
        <div class="action_buttons">
          <button @click=${this.closeDialog}>
            ${msg('options_cancel')}
          </button>
          <button @click=${this.addLanguage}>
            ${msg('options_addlanguage_addbutton')}
          </button>
        </div>
      </dialog>
    `;
  }

  showDialog() {
    const dialog = this.renderRoot.querySelector('dialog');
    dialog.showModal();
  }

  closeDialog() {
    this.renderRoot.querySelector('dialog').close();
  }

  addLanguage() {
    const languageCodes = Object.values(this.languages ?? {});
    const select = this.renderRoot.querySelector('#select_language') as HTMLSelectElement;

    const newLang = select.value;
    languageCodes.push(newLang);
    const translateinto = Object.assign({}, languageCodes);
    chrome.storage.sync.set({translateinto}, () => {
      select.selectedIndex = 0;
      this.closeDialog();
    });
  }
}
