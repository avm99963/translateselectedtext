// #!if ['chromium_mv3', 'edge_mv3'].includes(browser_target)
export default chrome.action;
// #!else
export default chrome.browserAction;
// #!endif
