import { FetchCurrentWeatherResponse } from '@/services/weather.service';
import { Title } from '@/shared/components/title/title.component';
import { Quote } from '@/types';

import {
  DictionaryApiDefinition,
  DictionaryApiMeaning,
  EnglishService,
  WordDefinition,
} from '@/services/english.service';
import { WeatherStore } from '@/stores/weather.store';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, of } from 'rxjs';

type TranslateApiEntry = DictionaryApiDefinition & {
  definitionTranslation?: string;
  exampleTranslation?: string;
  id: string;
};

type TranslationType = keyof Pick<
  TranslateApiEntry,
  'definitionTranslation' | 'exampleTranslation'
>;

type TranslateApiResponse = {
  partOfSpeech: DictionaryApiMeaning['partOfSpeech'];
  definitions: TranslateApiEntry[];
}[];

type VocabularyQueryParams = {
  searchingWord: string;
};

// 型ガード関数
function isVocabularyQueryParams(
  params: any
): params is VocabularyQueryParams {
  return (
    typeof params === 'object' &&
    params !== null &&
    'searchingWord' in params &&
    typeof params.searchingWord === 'string' &&
    Object.keys(params).length === 1
  );
}

@Component({
  selector: 'app-vocabulary-page',
  imports: [Title, FormsModule],
  templateUrl: './vocabulary-page.component.html',
})
export class VocabularyPageComponent {
  private readonly weatherStore = inject(WeatherStore);

  readonly weather = computed<FetchCurrentWeatherResponse | undefined>(() =>
    this.weatherStore.currentWeather?.()
  );

  // テンプレートで使用するための Object 公開
  readonly Object = Object;

  quotes: Quote[] = [];
  error: string = '';
  searchingWord: string = '';
  englishWordDefinition: WordDefinition[] = [];

  englishWordDefinitions = signal<
    Record<DictionaryApiMeaning['partOfSpeech'] | string, TranslateApiEntry[]>
  >({});

  readonly wordDefinitions = computed<TranslateApiResponse>(() =>
    Object.entries(this.englishWordDefinitions()).map((el) => {
      return {
        partOfSpeech: el[0] as DictionaryApiMeaning['partOfSpeech'],
        definitions: el[1],
      };
    })
  );

  constructor(
    private spinner: NgxSpinnerService,
    private englishService: EnglishService,
    private router: ActivatedRoute
  ) {}

  // 品詞のテキスト
  partOfSpeechText = (value: DictionaryApiMeaning['partOfSpeech']): string => {
    switch (value) {
      case 'noun':
        return '名詞';
      case 'verb':
        return '動詞';
      case 'adjective':
        return '形容詞';
      case 'adverb':
        return '副詞';
      case 'numeral':
        return '数詞';
      case 'pronoun':
        return '代名詞';
      case 'preposition':
        return '前置詞';
      case 'conjunction':
        return '接続詞';
      case 'interjection':
        return '感動詞';
      default:
        return 'その他';
    }
  };

  ngOnInit() {
    this.router.queryParams.subscribe((params) => {
      if (isVocabularyQueryParams(params)) {
        this.searchingWord = params.searchingWord;
        this.getDefinitions();
      }
    });
  }

  getDefinitions = (): void => {
    this.spinner.show();
    this.englishWordDefinitions.set({}); // リセット

    this.englishService
      .getWordDefinition(this.searchingWord.trim())
      .pipe(
        catchError((error) => {
          console.error('エラー:', error);
          this.error = error.message;
          return of([]);
        }),
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((definitions) => {
        this.englishWordDefinitions.update((state) => {
          const updated = { ...state };

          definitions.forEach((el) => {
            el.meanings.forEach((meaning) => {
              if (!updated[meaning.partOfSpeech]) {
                updated[meaning.partOfSpeech] = meaning.definitions.map(
                  (el, index) => ({
                    ...el,
                    id: meaning.partOfSpeech + '-' + index,
                  })
                );
                return;
              }

              updated[meaning.partOfSpeech] = [
                ...updated[meaning.partOfSpeech],
                ...meaning.definitions.map((el, index) => ({
                  ...el,
                  id:
                    meaning.partOfSpeech +
                    '-' +
                    (updated[meaning.partOfSpeech].length + index),
                })),
              ];
            });
          });

          return updated;
        });
      });
  };

  fetchTranslation = (
    partOfSpeech: DictionaryApiMeaning['partOfSpeech'],
    id: TranslateApiResponse[number]['definitions'][number]['id'],
    word: string,
    type: TranslationType
  ): void => {
    this.spinner.show();
    this.englishService
      .getTranslateWord(word.trim())
      .pipe(
        catchError((error) => {
          console.error('エラー:', error);
          this.error = error.message;
          return of([]);
        }),
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((definitions) => {
        this.englishWordDefinitions.update((state) => {
          const updated = { ...state };

          updated[partOfSpeech] = updated[partOfSpeech].map((definition) => {
            if (definition.id !== id) return definition;

            return {
              ...definition,
              [type]: definitions,
            };
          });

          return updated;
        });
      });
  };
}
