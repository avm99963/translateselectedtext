import '@polymer/paper-button/paper-button.js';
import './add-language-dialog';
import '../framework/ha-svg-icon';

import {mdiArrowDown, mdiArrowUp, mdiClose} from '@mdi/js';
import {css, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {map} from 'lit/directives/map.js';

import {isoLangs} from '../../../common/consts';
import {msg} from '../../../common/i18n';
import {TargetLangs} from '../../../common/options';
import {SHARED_STYLES} from '../../shared/shared-styles';

@customElement('languages-editor')
export default class LanguagesEditor extends LitElement {
  @property({type: Object}) languages: TargetLangs;

  static get styles() {
    return [
      SHARED_STYLES,
      css`
        #languages_container {
          width: 300px;
          height: 250px;
          border: 1px solid #ccc;
          background-color: #fafafa;
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
          background-color: white;
          -webkit-user-select: none;
        }

        #languages li .label {
          flex-grow: 1;
        }

        #languages li .delete {
          font-size: 18px;
          color: red;
        }

        #languages li .movebtn {
          font-size: 15px;
        }

        #languages li .movebtn:not([disabled]) {
          color: #1f649d;
        }

        #languages li :is(.delete, .movebtn) {
          min-width: 28px;
          width: 28px;
          min-height: 28px;
          height: 28px;
          padding: 4px;
          margin: 0;
        }

        #languages li ha-svg-icon {
          --mdc-icon-size: 16px;
        }

        #languages li paper-button:is(:hover, :focus) {
          background: rgba(0, 0, 0, 0.06);
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

  render() {
    const languageCodes = Object.values(this.languages ?? {});
    const languageList = map(languageCodes, (lang, i) => {
      const moveBtns = [];
      if (i != 0) {
        moveBtns.push(html`
          <paper-button
              class="movebtn"
              @click=${() => this.swapLanguages(i, i - 1)}>
            <ha-svg-icon .path=${mdiArrowUp}></ha-svg-icon>
          </paper-button>
        `);
      } else {
        moveBtns.push(html`
          <paper-button class="movebtn" disabled>
            <ha-svg-icon .path=${mdiArrowUp}></ha-svg-icon>
          </paper-button>
        `);
      }
      if (i != languageCodes.length - 1) {
        moveBtns.push(html`
          <paper-button
              class="movebtn"
              @click=${() => this.swapLanguages(i, i + 1)}>
            <ha-svg-icon .path=${mdiArrowDown}></ha-svg-icon>
          </paper-button>
        `);
      } else {
        moveBtns.push(html`
          <paper-button class="movebtn" disabled>
            <ha-svg-icon .path=${mdiArrowDown}></ha-svg-icon>
          </paper-button>
        `);
      }

      return html`
        <li data-id=${lang}>
          <span class="label">
            ${isoLangs?.[lang]?.['name']} (${isoLangs?.[lang]?.nativeName})
          </span>
          ${moveBtns}
          <paper-button
              class="delete"
              @click=${() => this.deleteLanguage(lang)}>
            <ha-svg-icon .path=${mdiClose}></ha-svg-icon>
          </paper-button>
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

  save(languageCodes: string[]) {
    const translateinto = Object.assign({}, languageCodes);
    chrome.storage.sync.set({translateinto});
  }

  deleteLanguage(deleteLang: string) {
    const languageCodes =
        Object.values(this.languages ?? {}).filter(lang => lang != deleteLang);
    this.save(languageCodes);
  }

  swapLanguages(i: number, j: number) {
    const languageCodes = Object.values(this.languages ?? {});
    if (i >= languageCodes.length || j >= languageCodes.length || i < 0 ||
        j < 0) {
      console.error(
          'Can\'t swap languages because the indexes are out of the range.');
      return;
    }
    const tmp = languageCodes[j];
    languageCodes[j] = languageCodes[i];
    languageCodes[i] = tmp;
    this.save(languageCodes);
  }
}
