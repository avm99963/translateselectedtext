// #!if ['chromium_mv3', 'edge_mv3'].includes(browser_target)
import ExtSessionStorage from './sessionStorage_mv3'
// #!else
import ExtSessionStorage from './sessionStorage_mv2'
// #!endif

export default ExtSessionStorage;
