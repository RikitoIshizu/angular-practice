export type Quote = {
  meigen: string;
  auther: string;
};

// Dictionary API types
export interface DictionaryApiLicense {
  name: string;
  url: string;
}

export interface DictionaryApiPhonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  license?: DictionaryApiLicense;
}

export interface DictionaryApiDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface DictionaryApiMeaning {
  partOfSpeech:
    | 'noun'
    | 'verb'
    | 'adjective'
    | 'adverb'
    | 'numeral'
    | 'pronoun'
    | 'preposition'
    | 'conjunction'
    | 'interjection';
  definitions: DictionaryApiDefinition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryApiEntry {
  word: string;
  phonetic?: string;
  phonetics?: DictionaryApiPhonetic[];
  meanings: DictionaryApiMeaning[];
  license?: DictionaryApiLicense;
  sourceUrls?: string[];
  origin?: string;
}

export type WordDefinition = {
  meanings: Pick<DictionaryApiMeaning, 'partOfSpeech' | 'definitions'>[];
};

// Translate API types
export interface TranslateMatch {
  id: number | string;
  segment: string;
  translation: string;
  source: string;
  target: string;
  quality: number;
  reference: string | null;
  'usage-count': number;
  subject: string | boolean;
  'created-by': string;
  'last-updated-by': string;
  'create-date': string;
  'last-update-date': string;
  match: number;
  penalty: number | null;
  model?: string;
}

export interface TranslateApiResponse {
  responseData: {
    translatedText: string;
    match: number;
  };
  quotaFinished: boolean;
  mtLangSupported: null;
  responseDetails: string;
  responseStatus: number;
  responderId: null;
  exception_code: null;
  matches: TranslateMatch[];
}

// Alphabet and payload types
export type AlphabetLetter =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

export type GetEnglishWordsPayload = {
  words?: string;
  length?: string;
  letter: AlphabetLetter | '';
};

export type GetEnglishQuotes = {
  id: number;
  quote: string;
  author: string;
};

export type GetEnglishTrivia = {
  id: string;
  text: string;
  source: string;
  source_url: string;
  language: string;
  permalink: string;
};
