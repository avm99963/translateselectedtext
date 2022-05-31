// To be able to import json5 files using Webpack:
declare module '*.json5' {
  const content: any;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}
