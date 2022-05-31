import {css} from 'lit';

export const DIALOG_STYLES = css`
  dialog {
    padding: 0;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  }


  dialog h3 {
    margin-bottom: 10px;
  }

  dialog::backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .scrollable {
    padding: 1em;
    overflow-y: auto;
  }

  .action_buttons {
    border-top: 1px solid #ccc;
    padding: 1em;
    text-align: end;
  }
`;
