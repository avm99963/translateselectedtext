import {css, html, LitElement} from 'lit';
import {map} from 'lit/directives/map.js';

import {isoLangs} from '../../../common/consts.js';
import {msg} from '../../../common/i18n.js';
import {SHARED_STYLES} from '../../shared/shared-styles.js';

import AddLanguageDialog from './add-language-dialog.js';

export class LanguagesEditor extends LitElement {
  static properties = {
    languages: {type: Object},
  };

  static get styles() {
    return [
      SHARED_STYLES,
      css`
        #languages_container {
          width: 300px;
          height: 250px;
          border: 1px solid #ccc;
          background-color: #E3F2FD;
          overflow: auto;
        }

        #languages {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        #languages li {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 15px;
          border-bottom: 1px dashed #ddd;
          background-color: #EEF7FD;
          -webkit-user-select: none;
        }

        #languages li .label {
          flex-grow: 1;
        }

        #languages li .delete {
          font-size: 18px;
          color: red;
          padding-left: 2px;
          margin-left: 2px;
        }

        #languages li .movebtn {
          font-size: 16px;
          color: blue;
          padding: 0 2px;
          margin: 0 2px;
        }

        #languages li :is(.delete, .movebtn) {
          cursor: pointer;
          text-align: center;
        }

        #languages li .movebtn--disabled {
          color: gray;
          cursor: not-allowed;
        }

        #languages_footer {
          width: 300px;
          height: 35px;
          background-color: #fff;
          border: 1px solid #ccc;
          border-top: 0;
        }

        #languages_add {
          margin-inline-start: 4px;
          margin-top: 4px;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.addEventListener('show-credits-dialog', this.showDialog);
    this.sortable = undefined;
  }

  render() {
    let languageCodes = Object.values(this.languages ?? {});
    let languageList = map(languageCodes, (lang, i) => {
      let moveBtns = [];
      if (i != 0) {
        moveBtns.push(html`
          <button
              class="notbtn movebtn"
              @click=${() => this.swapLanguages(i, i - 1)}>
            ↑
          </button>
        `);
      } else {
        moveBtns.push(html`
          <button class="notbtn movebtn movebtn--disabled">
            ↑
          </button>
        `);
      }
      if (i != languageCodes.length - 1) {
        moveBtns.push(html`
          <button
              class="notbtn movebtn"
              @click=${() => this.swapLanguages(i, i + 1)}>
            ↓
          </button>
        `);
      } else {
        moveBtns.push(html`
          <button class="notbtn movebtn movebtn--disabled">
            ↓
          </button>
        `);
      }

      return html`
        <li data-id=${lang}>
          <span class="label">
            ${isoLangs?.[lang]?.['name']} (${isoLangs?.[lang]?.nativeName})
          </span>
          ${moveBtns}
          <button
              class="notbtn delete"
              @click=${() => this.deleteLanguage(lang)}>
            ×
          </button>
        </li>
      `;
    });

    return html`
      <div id="languages_container">
        <ul id="languages">${languageList}</ul>
      </div>
      <div id="languages_footer">
        <button @click=${this.showAddLanguageDialog} id="languages_add">
          ${msg('options_addlanguage_addbutton')}
        </button>
      </div>

      <add-language-dialog .languages=${this.languages}></add-language-dialog>
    `;
  }

  showAddLanguageDialog() {
    const e = new CustomEvent(
        'show-add-language-dialog', {bubbles: true, composed: true});
    this.renderRoot.querySelector('add-language-dialog').dispatchEvent(e);
  }

  save(languageCodes) {
    let translateinto = Object.assign({}, languageCodes);
    chrome.storage.sync.set({translateinto});
  }

  deleteLanguage(deleteLang) {
    let languageCodes =
        Object.values(this.languages ?? {}).filter(lang => lang != deleteLang);
    this.save(languageCodes);
  }

  swapLanguages(i, j) {
    let languageCodes = Object.values(this.languages ?? {});
    if (i >= languageCodes.length || j >= languageCodes.length || i < 0 ||
        j < 0) {
      console.error(
          'Can\'t swap languages because the indexes are out of the range.');
      return;
    }
    let tmp = languageCodes[j];
    languageCodes[j] = languageCodes[i];
    languageCodes[i] = tmp;
    this.save(languageCodes);
  }
}
customElements.define('languages-editor', LanguagesEditor);
