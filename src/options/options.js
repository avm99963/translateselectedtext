import {css, html, LitElement} from 'lit';

import {msg} from '../common/i18n.js';

import CreditsDialog from './elements/credits-dialog/credits-dialog.js';
import OptionsEditor from './elements/options-editor/options-editor.js';

import {SHARED_STYLES} from './shared/shared-styles.js';

export class OptionsPage extends LitElement {
  static properties = {
    _storageData: {type: Object, state: true},
  }

  constructor() {
    super();
    this._storageData = undefined;
    this.updateStorageData();
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName == 'sync') this.updateStorageData();
    });
  }

  static get styles() {
    return [
      SHARED_STYLES,
      css`
        :host {
          display: block;
          padding: 10px;
          margin: 14px 17px;
          font-family: "Roboto", "Arial", sans-serif!important;
        }

        #credits_container {
          position: absolute;
          top: 0px;
          inset-inline-end: 50px;
          background: rgb(195, 235, 204);
          border: solid 1px rgb(139, 139, 139);
          border-top: 0;
          border-radius: 0px 0px 5px 5px;
        }

        #credits_container button#credits {
          color: green!important;
          margin: 0 5px;
          padding: 1px 3px;
          text-decoration: underline;
          cursor: pointer;
        }
      `,
    ];
  }

  render() {
    return html`
      <div id="credits_container">
        <button
            @click="${this.showCredits}" id="credits"
            class="notbtn" tabindex="0" role="button">
          ${msg('options_credits')}
        </button>
      </div>
      <h1 id="welcome">${msg('options_welcome')}</h1>
      <p id="introduction">${msg('options_introduction')}</p>
      <options-editor .storageData=${this._storageData}></options-editor>
      <credits-dialog></credits-dialog>
    `;
  }

  updateStorageData() {
    chrome.storage.sync.get(null, items => {
      // If no settings are set
      if (Object.keys(items).length === 0) {
        items = {
          translateinto: {},
          uniquetab: 'popup',
        };
        chrome.storage.sync.set(items);
      }
      this._storageData = items;
    });
  }

  showCredits() {
    const e =
        new CustomEvent('show-credits-dialog', {bubbles: true, composed: true});
    this.renderRoot.querySelector('credits-dialog').dispatchEvent(e);
  }
}
customElements.define('options-page', OptionsPage);
