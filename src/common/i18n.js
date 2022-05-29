// Helper function which serves as a shorter alias to the chrome.i18n.getMessage
// method, specially useful inside lit templates.
export function msg(...args) {
  return chrome.i18n.getMessage(...args);
}
