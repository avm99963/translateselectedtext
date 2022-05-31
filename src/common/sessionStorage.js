// #!if ['chromium_mv3', 'edge_mv3'].includes(browser_target)
import ExtSessionStorage from './sessionStorage_mv3.js'
// #!else
import ExtSessionStorage from './sessionStorage_mv2.js'
// #!endif

export default ExtSessionStorage;
