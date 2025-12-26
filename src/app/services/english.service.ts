import {
  DictionaryApiEntry,
  GetEnglishQuotes,
  GetEnglishWordsPayload,
  TranslateApiResponse,
  WordDefinition,
} from '@/types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

type DictionaryApiResponse = DictionaryApiEntry[];

@Injectable({
  providedIn: 'root',
})
export class EnglishService {
  private readonly WORDS_API_URL = '/api/english-vocabulary';

  constructor(private http: HttpClient) {}

  getWordDefinition = (word: string): Observable<WordDefinition[]> => {
    return this.http
      .get<DictionaryApiResponse>(`/api/english-dictionary/${word}`)
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
  };

  getTranslateWord = (
    word: string
  ): Observable<TranslateApiResponse['responseData']['translatedText']> => {
    let params = new HttpParams().set('q', word).set('langpair', 'en|ja');

    return this.http
      .get<TranslateApiResponse>('/api/english-translate', { params })
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
  };

  getEnglishWords = (payload: GetEnglishWordsPayload) => {
    let params = new HttpParams().set('alphabetize', 'true');

    if (payload.words) params = params.set('words', payload.words);
    if (payload.length) params = params.set('length', payload.length);
    if (payload.letter) params = params.set('letter', payload.letter);

    return this.http.get<string[]>(this.WORDS_API_URL, { params }).pipe(
      map((res) => [...new Set(res)]),
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
  };

  getEnglishQuotes = () => {
    return this.http.get<GetEnglishQuotes>('/api/english-quote/random').pipe(
      map((res) => {
        console.log(res);
      }),
      catchError((error) => {
        console.error('単語の名言の取得に失敗:', error);
        return throwError(
          () =>
            new Error(
              '単語の名言の取得に失敗しました。もう一度お試しください。'
            )
        );
      })
    );
  };
}
