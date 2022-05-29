import {css, html, LitElement} from 'lit';
import {map} from 'lit/directives/map.js';

import {msg} from '../../../common/i18n.js';
import {SHARED_STYLES} from '../../shared/shared-styles.js';

import LanguagesEditor from './languages-editor.js';

const TAB_OPTIONS = [
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
                  value="${option?.value}" ?checked="${checked}"
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
      var background = chrome.extension.getBackgroundPage();

      background.translator_tab = false;
      background.translator_window = false;
    });
  }
}
customElements.define('options-editor', OptionsEditor);
