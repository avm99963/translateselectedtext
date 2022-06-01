import {DataType} from '../background';

export default class URLFactory {
  static getTranslationURL(
      lang: string, info: chrome.contextMenus.OnClickData,
      dataType: DataType) {
    switch (dataType) {
      case DataType.DataTypeText:
        return URLFactory.getTranslationURLForText(lang, info.selectionText);

      case DataType.DataTypeURL:
        return URLFactory.getTranslationURLForURL(lang, info.linkUrl);

      default:
        console.error('Can\'t return translation URL for unknown data type.');
        return 'about:blank?translate_selected_text_error';
    }
  }

  static getTranslationURLForText(lang: string, text: string): string {
    const params = new URLSearchParams({
      sl: 'auto',
      tl: lang,
      text: text,
      op: 'translate',
    });
    return 'https://translate.google.com/?' + params.toString();
  }

  static getTranslationURLForURL(lang: string, url: string): string {
    const params = new URLSearchParams({
      sl: 'auto',
      tl: lang,
      u: url,
    });
    return 'https://translate.google.com/translate?' + params.toString();
  }
}
