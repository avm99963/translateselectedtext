import {css} from 'lit';

export const SHARED_STYLES = css`
  button:not(.notbtn),
  input,
  select,
  option {
    font-size: 13px !important;
  }

  button.notbtn {
    appearance: none;
    background: none;
    border: none;
    border-radius: 0;
    font: inherit;
    padding: 0;
  }

  h1, h2, h3 {
    user-select: none;
    font-weight: normal;
    line-height: 1;
  }

  h1 {
    text-align: center;
    font-size: 30px;
  }

  h2 {
    font-size: 20px;
    margin-bottom: 12px;
  }

  /* Copy of Chrome stylesheet (widgets.css), adapted by not applying styles
   * for buttons with the class |nobtn|.
   **/

  /* Copyright (c) 2012 The Chromium Authors. All rights reserved.
   * Use of this source code is governed by a BSD-style license that can be
   * found in https://chromium.googlesource.com/chromium/src/+/master/LICENSE */

  /* This file defines styles for form controls. The order of rule blocks is
   * important as there are some rules with equal specificity that rely on order
   * as a tiebreaker. These are marked with OVERRIDE. */

  /* Default state **************************************************************/

  :-webkit-any(button:not(.notbtn),
               input[type='button'],
               input[type='submit']):not(.custom-appearance):not(.link-button),
  select,
  input[type='checkbox'],
  input[type='radio'] {
    -webkit-appearance: none;
    -webkit-user-select: none;
    background-image: -webkit-linear-gradient(#ededed, #ededed 38%, #dedede);
    border: 1px solid rgba(0, 0, 0, 0.25);
    border-radius: 2px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08),
        inset 0 1px 2px rgba(255, 255, 255, 0.75);
    color: #444;
    font: inherit;
    margin: 0 1px 0 0;
    outline: none;
    text-shadow: 0 1px 0 rgb(240, 240, 240);
  }

  :-webkit-any(button:not(.notbtn),
               input[type='button'],
               input[type='submit']):not(.custom-appearance):not(.link-button),
  select {
    min-height: 2em;
    min-width: 4em;

  }

  :-webkit-any(button:not(.notbtn),
               input[type='button'],
               input[type='submit']):not(.custom-appearance):not(.link-button) {
    -webkit-padding-end: 10px;
    -webkit-padding-start: 10px;
  }

  select {
    -webkit-appearance: none;
    -webkit-padding-end: 20px;
    -webkit-padding-start: 6px;
    /* OVERRIDE */
    background-image: -webkit-image-set(url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAICAQAAACxSAwfAAAAUklEQVQY02P4z0AMRGZGMaShwCisyhITmb8huMzfEhOxKvuvsGAh208Ik+3ngoX/FbBbClcIUcSAw21QhXxfIIrwKAMpfNsEUYRXGVCEFc6CQwBqq4CCCtU4VgAAAABJRU5ErkJggg==') 1x, url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAQCAQAAAA/1a6rAAAAQUlEQVR4Xu3MsQnAMBAEMI1+myf9gw0+3ASCenmu+mQn2yGn3S4Mp906DEW3CEPfzTD03QxD380w3OmIUHe9v+u9QwAt93yns5cAAAAASUVORK5CYII=') 2x),
        -webkit-linear-gradient(#ededed, #ededed 38%, #dedede);
    background-position: right center;
    background-repeat: no-repeat;
  }

  html[dir='rtl'] select {
    background-position: center left;
  }

  input[type='checkbox'] {

  bottom: 2px;
    height: 13px;
    position: relative;
    vertical-align: middle;
    width: 13px;
  }

  input[type='radio'] {
    /* OVERRIDE */
    border-radius: 100%;
    bottom: 1px;
    height: 15px;
    position: relative;
    vertical-align: middle;
    width: 15px;
  }

  /* TODO(estade): add more types here? */
  input[type='number'],
  input[type='password'],
  input[type='search'],
  input[type='text'],
  input[type='url'],
  input:not([type]),
  textarea {
    border: 1px solid #bfbfbf;
    border-radius: 2px;
    box-sizing: border-box;
    color: #444;
    font: inherit;
    margin: 0;
    /* Use min-height to accommodate addditional padding for touch as needed. */
    min-height: 2em;
    padding: 3px;
    outline: none;
  /* For better alignment between adjacent buttons and inputs. */
    padding-bottom: 4px;
  }

  input[type='search'] {
    -webkit-appearance: textfield;
    /* NOTE: Keep a relatively high min-width for this so we don't obscure the end
     * of the default text in relatively spacious languages (i.e. German). */
    min-width: 160px;
  }

  /* Remove when https://bugs.webkit.org/show_bug.cgi?id=51499 is fixed.
   * TODO(dbeam): are there more types that would benefit from this? */
  input[type='search']::-webkit-textfield-decoration-container {
    direction: inherit;
  }

  /* Checked ********************************************************************/

  input[type='checkbox']:checked::before {
    -webkit-user-select: none;
    background-image: -webkit-image-set(url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAQAAAADpb+tAAAAaElEQVR4Xl3PIQoCQQCF4Y8JW42D1bDZ4iVEjDbxFpstYhC7eIVBZHkXFGw734sv/TqDQQ8Xb1udja/I8igeIm7Aygj2IpoKTGZnVRNxAHYi4iPiDlA9xX+aNQDFySziqDN6uSp6y7ofEMwZ05uUZRkAAAAASUVORK5CYII=') 1x, url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAQAAABuvaSwAAAAvElEQVR4XrXPMUrDYBzG4UeRZnAQnFxq3XT3AsVABm8QPIHQIeAJuoqb2s1BcHAIin4HVLqEvx9NQgb5rc/wvn4mNBUbqlKDcezCp6Qexxx7lbapx/CBe6mrHsYrKXQ7hKtIre1nOD/W9eiQiK80inis680JEc+1kien+TEfzom4sJG2aZXxmG9LIqaRerohx6V2J72zl2NY2OTUgxm7MEU25sURfZg4590Zw5iFZ8mXS0ZwN+eaPjyh/8O/H7bzPJ5NOo0AAAAASUVORK5CYII=') 2x);
    background-size: 100% 100%;
    content: '';
    display: block;
    height: 100%;
    width: 100%;
  }

  input[type='radio']:checked::before {
    background-color: #666;
    border-radius: 100%;
    bottom: 3px;
    content: '';
    display: block;
    left: 3px;
    position: absolute;
    right: 3px;
    top: 3px;
  }

  /* Hover **********************************************************************/

  :enabled:hover:-webkit-any(
      select,
      input[type='checkbox'],
      input[type='radio'],
      :-webkit-any(
          button:not(.notbtn),
          input[type='button'],
          input[type='submit']):not(.custom-appearance):not(.link-button)) {
    background-image: -webkit-linear-gradient(#f0f0f0, #f0f0f0 38%, #e0e0e0);
    border-color: rgba(0, 0, 0, 0.3);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.12),
        inset 0 1px 2px rgba(255, 255, 255, 0.95);
    color: black;
  }

  :enabled:hover:-webkit-any(select) {
    /* OVERRIDE */
    background-image: -webkit-image-set(url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAICAQAAACxSAwfAAAAUklEQVQY02P4z0AMRGZGMaShwCisyhITmb8huMzfEhOxKvuvsGAh208Ik+3ngoX/FbBbClcIUcSAw21QhXxfIIrwKAMpfNsEUYRXGVCEFc6CQwBqq4CCCtU4VgAAAABJRU5ErkJggg==') 1x, url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAQCAQAAAA/1a6rAAAAQUlEQVR4Xu3MsQnAMBAEMI1+myf9gw0+3ASCenmu+mQn2yGn3S4Mp906DEW3CEPfzTD03QxD380w3OmIUHe9v+u9QwAt93yns5cAAAAASUVORK5CYII=') 2x),
        -webkit-linear-gradient(#f0f0f0, #f0f0f0 38%, #e0e0e0);
  }

  /* Active *********************************************************************/

  :enabled:active:-webkit-any(
      select,
      input[type='checkbox'],
      input[type='radio'],
      :-webkit-any(
          button:not(.notbtn),
          input[type='button'],
          input[type='submit']):not(.custom-appearance):not(.link-button)) {
    background-image: -webkit-linear-gradient(#e7e7e7, #e7e7e7 38%, #d7d7d7);
    box-shadow: none;
    text-shadow: none;
  }

  :enabled:active:-webkit-any(select) {
    /* OVERRIDE */
    background-image: -webkit-image-set(url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAICAQAAACxSAwfAAAAUklEQVQY02P4z0AMRGZGMaShwCisyhITmb8huMzfEhOxKvuvsGAh208Ik+3ngoX/FbBbClcIUcSAw21QhXxfIIrwKAMpfNsEUYRXGVCEFc6CQwBqq4CCCtU4VgAAAABJRU5ErkJggg==') 1x, url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAQCAQAAAA/1a6rAAAAQUlEQVR4Xu3MsQnAMBAEMI1+myf9gw0+3ASCenmu+mQn2yGn3S4Mp906DEW3CEPfzTD03QxD380w3OmIUHe9v+u9QwAt93yns5cAAAAASUVORK5CYII=') 2x),
        -webkit-linear-gradient(#e7e7e7, #e7e7e7 38%, #d7d7d7);
  }

  /* Disabled *******************************************************************/

  :disabled:-webkit-any(
      button:not(.notbtn),
      input[type='button'],
      input[type='submit']):not(.custom-appearance):not(.link-button),
  select:disabled {
    background-image: -webkit-linear-gradient(#f1f1f1, #f1f1f1 38%, #e6e6e6);
    border-color: rgba(80, 80, 80, 0.2);
    box-shadow: 0 1px 0 rgba(80, 80, 80, 0.08),
        inset 0 1px 2px rgba(255, 255, 255, 0.75);
    color: #aaa;
  }

  select:disabled {
    /* OVERRIDE */
    background-image: -webkit-image-set(url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAICAQAAACxSAwfAAAASklEQVQY02P4z0AMRGZGMaShwCisyhITG/4jw8RErMr+KyxYiFC0YOF/BeyWIikEKWLA4Ta4QogiPMpACt82QRThVQYUYYWz4BAAGr6Ii6kEPacAAAAASUVORK5CYII=') 1x, url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAQCAQAAADQF8WVAAAARElEQVR4Xu3MsQ0AIAwEsYx+m4fySsgLOuTe1Re9z4De4DzbdVDnmZ0ENcrsZJVkdoIKMzurMLOzSjNhlWfCapBlfpZbeMFeGdxKIEQAAAAASUVORK5CYII=') 2x),
        -webkit-linear-gradient(#f1f1f1, #f1f1f1 38%, #e6e6e6);
  }

  input:disabled:-webkit-any([type='checkbox'],
                             [type='radio']) {
    opacity: .75;
  }

  input:disabled:-webkit-any([type='password'],
                             [type='search'],
                             [type='text'],
                             [type='url'],
                             :not([type])) {
    color: #999;
  }

  /* Focus **********************************************************************/

  :enabled:focus:-webkit-any(
      select,
      input[type='checkbox'],
      input[type='number'],
      input[type='password'],
      input[type='radio'],
      input[type='search'],
      input[type='text'],
      input[type='url'],
      input:not([type]),
      :-webkit-any(
           button:not(.notbtn),
           input[type='button'],
           input[type='submit']):not(.custom-appearance):not(.link-button)) {
    /* OVERRIDE */
    -webkit-transition: border-color 200ms;
    /* We use border color because it follows the border radius (unlike outline).
     * This is particularly noticeable on mac. */
    border-color: rgb(77, 144, 254);
    outline: none;
  }

  /* Link buttons ***************************************************************/

  .link-button {
    -webkit-box-shadow: none;
    background: transparent none;
    border: none;
    color: rgb(17, 85, 204);
    cursor: pointer;
    /* Input elements have -webkit-small-control which can override the body font.
     * Resolve this by using 'inherit'. */
    font: inherit;
    margin: 0;
    padding: 0;
  }

  .link-button:hover {
    text-decoration: underline;
  }

  .link-button:active {
    color: rgb(5, 37, 119);
    text-decoration: underline;
  }

  .link-button[disabled] {
    color: #999;
    cursor: default;
    text-decoration: none;
  }

  /* Checkbox/radio helpers ******************************************************
   *
   * .checkbox and .radio classes wrap labels. Checkboxes and radios should use
   * these classes with the markup structure:
   *
   *   <div class="checkbox">
   *     <label>
   *       <input type="checkbox"></input>
   *       <span>
   *     </label>
   *   </div>
   */

  :-webkit-any(.checkbox, .radio) label {
    /* Don't expand horizontally: <http://crbug.com/112091>. */
    display: -webkit-inline-box;
    padding-bottom: 7px;
    padding-top: 7px;
  }

  :-webkit-any(.checkbox, .radio) label input ~ span {
    -webkit-margin-start: 0.6em;
    -webkit-user-select: none;
    /* Make sure long spans wrap at the same horizontal position they start. */
    display: block;
  }

  :-webkit-any(.checkbox, .radio) label:hover {
    color: black;
  }

  label > input:disabled:-webkit-any([type='checkbox'], [type='radio']) ~ span {
    color: #999;
  }
`;
