import './languages-editor';

import {css, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {map} from 'lit/directives/map.js';

import {msg} from '../../../common/i18n';
import {OptionsV0, TAB_OPTIONS, TabOptionValue} from '../../../common/options';
import {SHARED_STYLES} from '../../shared/shared-styles';

@customElement('options-editor')
export default class OptionsEditor extends LitElement {
  @property({type: Object}) storageData: OptionsV0;

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

  render() {
    const currentTabOption = this.storageData?.uniquetab;

    const otherOptions = map(TAB_OPTIONS, (option, i) => {
      const checked = option.value == currentTabOption ||
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

  changeTabOption(value: TabOptionValue) {
    chrome.storage.sync.set({uniquetab: value}, function() {
      chrome.runtime.sendMessage({action: 'clearTranslatorTab'});
    });
  }
}
