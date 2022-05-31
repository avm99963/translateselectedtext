import {css, html, LitElement} from 'lit';
import {map} from 'lit/directives/map.js';

import {msg} from '../../../common/i18n';
import {TAB_OPTIONS} from '../../../common/options';
import {SHARED_STYLES} from '../../shared/shared-styles';

import LanguagesEditor from './languages-editor';

export class OptionsEditor extends LitElement {
  static properties = {
    storageData: {type: Object},
  };

  static get styles() {
    return [
      SHARED_STYLES,
      css`
        #otheroptions p {
          margin-top: 0;
          margin-bottom: 8px;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.addEventListener('show-credits-dialog', this.showDialog);
  }

  render() {
    let currentTabOption = this.storageData?.uniquetab;

    let otherOptions = map(TAB_OPTIONS, (option, i) => {
      let checked = option.value == currentTabOption ||
          option.deprecatedValues.includes(currentTabOption);
      return html`
            <p>
              <input type="radio" name="uniquetab" id="uniquetab_${i}"
                  value="${option?.value}" .checked="${checked}"
                  @change="${() => this.changeTabOption(option.value)}">
              <label for="uniquetab_${i}">${msg(option.labelMsg)}</label></p>
          `;
    });

    return html`
      <languages-editor .languages="${this.storageData?.translateinto}">
      </languages-editor>

      <h2 id="otheroptionsheader">${msg('options_otheroptionsheader')}</h2>

      <div id="otheroptions">
        ${otherOptions}
      </div>
    `;
  }

  changeTabOption(value) {
    chrome.storage.sync.set({uniquetab: value}, function() {
      chrome.runtime.sendMessage({action: 'clearTranslatorTab'});
    });
  }
}
customElements.define('options-editor', OptionsEditor);
