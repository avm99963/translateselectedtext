/*
 * Written by the Home Assistant frontend authors, and copied here under the
 * Apache 2.0 license
 * (https://github.com/home-assistant/frontend/blob/dev/LICENSE.md).
 *
 * Slightly adapted.
 *
 * Original file:
 * https://github.com/home-assistant/frontend/blob/4922e575f822c65d81fcde1225cfee5e338ac997/src/components/ha-svg-icon.ts
 **/
import {css, CSSResultGroup, LitElement, svg, SVGTemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('ha-svg-icon')
export class HaSvgIcon extends LitElement {
  @property() public path?: string;

  @property() public viewBox?: string;

  protected render(): SVGTemplateResult {
    return svg`
    <svg
      viewBox=${this.viewBox || '0 0 24 24'}
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
      role="img" 
      aria-hidden="true"
    >
      <g>
      ${this.path ? svg`<path d=${this.path}></path>` : ''}
      </g>
    </svg>`;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: var(--ha-icon-display, inline-flex);
        align-items: center;
        justify-content: center;
        position: relative;
        vertical-align: middle;
        fill: currentcolor;
        width: var(--mdc-icon-size, 24px);
        height: var(--mdc-icon-size, 24px);
      }
      svg {
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: block;
      }
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'ha-svg-icon': HaSvgIcon;
  }
}
