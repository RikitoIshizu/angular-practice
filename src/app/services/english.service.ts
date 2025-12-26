import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

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

type DictionaryApiResponse = DictionaryApiEntry[];

export type WordDefinition = {
  meanings: Pick<DictionaryApiMeaning, 'partOfSpeech' | 'definitions'>[];
};

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

@Injectable({
  providedIn: 'root',
})
export class EnglishService {
  private readonly WORD_DEFINITION_API_URL = '/english-dictionary';
  private readonly TRANSLATE_API_URL = '/english-translate';

  constructor(private http: HttpClient) {}

  getWordDefinition(word: string): Observable<WordDefinition[]> {
    return this.http
      .get<DictionaryApiResponse>(`${this.WORD_DEFINITION_API_URL}/${word}`)
      .pipe(
        map((res) =>
          res.map((entry) => {
            return {
              meanings: entry.meanings.map((meaning) => ({
                partOfSpeech: meaning.partOfSpeech,
                definitions: meaning.definitions,
              })),
            };
          })
        ),
        catchError((error) => {
          console.error('単語の定義の取得に失敗:', error);
          return throwError(
            () =>
              new Error(
                '単語の定義の取得に失敗しました。もう一度お試しください。'
              )
          );
        })
      );
  }

  getTranslateWord(
    word: string
  ): Observable<TranslateApiResponse['responseData']['translatedText']> {
    return this.http
      .get<TranslateApiResponse>(
        `${this.TRANSLATE_API_URL}?q=${encodeURIComponent(word)}&langpair=en|ja`
      )
      .pipe(
        map((res) => {
          return res.responseData.translatedText;
        }),
        catchError((error) => {
          console.error('単語の翻訳の取得に失敗:', error);
          return throwError(
            () =>
              new Error(
                '単語の翻訳の取得に失敗しました。もう一度お試しください。'
              )
          );
        })
      );
  }
}
