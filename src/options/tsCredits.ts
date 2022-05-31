import creditsRaw from './credits.json5';
import i18nCreditsRaw from './i18n-credits.json5';

interface Credit {
  name: string;
  url?: string;
  author?: string;
  license?: string;
}

type Credits = Credit[]

interface CrowdinLang {
  id: string;
  name: string;
}

interface IntCredit {
  name: string;
  languages: CrowdinLang[];
}

type IntCredits = IntCredit[];

export const credits: Credits = creditsRaw;
export const i18nCredits: IntCredits = i18nCreditsRaw;
