import {css, html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {map} from 'lit/directives/map.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

import {msg} from '../../../common/i18n';
import {DIALOG_STYLES} from '../../shared/dialog-styles';
import {SHARED_STYLES} from '../../shared/shared-styles';
import {credits, i18nCredits} from '../../tsCredits';

@customElement('credits-dialog')
export default class CreditsDialog extends LitElement {
  static get styles() {
    return [
      SHARED_STYLES,
      DIALOG_STYLES,
      css`
        dialog {
          max-height: 430px;
          width: 400px;
        }

        dialog[open] {
          display: flex;
          flex-direction: column;
        }

        .content_area h4 {
          margin-bottom: 0;
        }

        .entry {
          position: relative;
        }

        .entry a.homepage {
          position: absolute;
          inset-inline-end: 16px;
          font-size: 14px;
        }

        p,
        span {
          font-size: 14px;
        }

        p.author {
          margin-top: 7px;
        }

        #translators .name {
          font-weight: bold;
        }

        .createdby {
          font-style: italic;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.addEventListener('show-credits-dialog', this.showDialog);
  }

  render() {
    const translators = map(i18nCredits, (contributor) => {
      const languagesArray =
          contributor?.languages?.map?.((lang) => lang?.name ?? 'undefined');
      const languages =
          languagesArray.length > 0 ? ': ' + languagesArray.join(', ') : '';
      return html`
        <li><span class="name">${contributor?.name}</span>${languages}</li>
      `;
    });

    const homepageMsg = msg('options_credits_homepage');
    const creditsByMsg = msg('options_credits_by');

    const otherCredits = map(credits, (c) => {
      const url = c.url ?
          html` <a href=${c?.url} target="_blank" class="homepage">
            ${homepageMsg}
          </a>` :
          undefined;
      const license = c.license ? ' - ' + c.license : '';
      const author = c.author ?
          html` <p class="author">${creditsByMsg} ${c.author}${license}</p> ` :
          undefined;

      return html`
        <div class="entry">
          ${url}
          <h4>${c?.name}</h4>
          ${author}
        </div>
      `;
    });

    return html`
      <dialog>
        <div class="scrollable">
          <h3>${msg('options_credits')}</h3>
          <div class="entry createdby">
            <div>${unsafeHTML(msg('options_credits_createdby'))}</div>
          </div>
          <div class="entry">
            <a href="https://gtranslate.avm99963.com/" class="homepage" target="_blank">
              ${msg('options_credits_homepage')}
            </a>
            <h4>${msg('options_credits_translations')}</h4>
            <div>${msg('options_credits_translations_paragraph')}</div>
            <ul id="translators">
              ${translators}
            </ul>
          </div>
          <div class="content_area">${otherCredits}</div>
        </div>
        <div class="action_buttons">
          <button id="credits_ok" @click="${this.closeDialog}">
            ${msg('options_ok')}
          </button>
        </div>
      </dialog>
    `;
  }

  showDialog() {
    const dialog = this.renderRoot.querySelector('dialog');
    dialog.showModal();
    dialog.querySelector('.scrollable').scrollTo(0, 0);
    (dialog.querySelector('#credits_ok') as HTMLElement).focus();
  }

  closeDialog() {
    this.renderRoot.querySelector('dialog').close();
  }
}
