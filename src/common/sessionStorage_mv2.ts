declare global {
  interface Window {
    extCustomStorage: any;
  }
}

export default class ExtSessionStorage {
  static set(items: any): Promise<void> {
    return new Promise((res, rej) => {
      if (window.extCustomStorage === undefined) window.extCustomStorage = {};

      for (const [key, value] of Object.entries(items))
        window.extCustomStorage[key] = value;

      res();
    });
  }

  static get(keys: string|Array<string>|undefined): Promise<any> {
    return new Promise((res, rej) => {
      if (window.extCustomStorage === undefined) window.extCustomStorage = {};

      if (keys === undefined) {
        res(window.extCustomStorage);
        return;
      }

      if (typeof keys === 'string') {
        const key = keys;
        keys = [key];
      }

      if (Array.isArray(keys)) {
        let returnObject: any = {};
        for (const key of keys) {
          returnObject[key] = window.extCustomStorage[key];
        }
        res(returnObject);
        return;
      }

      rej(new Error(
          'The keys passed are not a valid type ' +
          '(undefined, string or array).'));
    });
  }
}
