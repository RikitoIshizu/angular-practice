import { Trivia } from '@/pages/trivia/trivia.component';
import { GetEnglishQuotes } from '@/types';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type Quotes = GetEnglishQuotes & {
  translation?: string;
};

export type ScoreState = {
  score: {
    vocabulary: {
      amount: {
        translation: number;
        searchingWords: number;
      };
      words: string[];
    };
    quote: {
      amount: {
        translation: number;
      };
      words: Quotes[];
    };
    trivia: {
      amount: {
        translation: number;
        gottenTrivia: number;
      };
      words: Trivia[];
    };
    quiz: {
      amount: {
        translation: number;
      };
    };
  };
};

const initialState: ScoreState = {
  score: {
    vocabulary: {
      amount: {
        translation: 0,
        searchingWords: 0,
      },
      words: [],
    },
    quote: {
      amount: { translation: 0 },
      words: [],
    },
    trivia: {
      amount: { translation: 0, gottenTrivia: 0 },
      words: [],
    },
    quiz: {
      amount: { translation: 0 },
    },
  },
};

export const LearningScoreStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    // 学習状況をリセットする
    reset: (): void => {
      patchState(store, initialState);
    },
    // トリビア関連の回数をカウントする
    setTriviaAmount: (
      key: keyof ScoreState['score']['trivia']['amount']
    ): void => {
      patchState(store, (state: ScoreState): ScoreState => {
        // 新しくセットするデータ
        const newTriviaState: Partial<ScoreState['score']['trivia']['amount']> = {
          [key]: state.score.trivia.amount[key] + 1,
        };

        return {
          score: {
            ...state.score,
            trivia: {
              ...state.score.trivia,
              amount: {
                ...state.score.trivia.amount,
                ...newTriviaState,
              },
            },
          },
        };
      });
    },
    // 実際に取得したトリビアをセットする
    setTriviaWord: (trivia: Trivia): void => {
      patchState(store, (state: ScoreState): ScoreState => {
        // 新しくセットするデータ
        const words: ScoreState['score']['trivia']['words'] = [
          ...state.score.trivia.words,
          trivia,
        ];

        return {
          score: {
            ...state.score,
            trivia: {
              ...state.score.trivia,
              words,
            },
          },
        };
      });
    },

    // 英語の回数をカウントする
    setQuotesAmount: (): void => {
      patchState(store, (state: ScoreState): ScoreState => {
        // 新しくセットするデータ
        const translation: ScoreState['score']['quote']['amount']['translation'] =
          state.score.quote.amount.translation + 1;

        return {
          score: {
            ...state.score,
            quote: {
              ...state.score.quote,
              amount: {
                ...state.score.quote.amount,
                translation,
              },
            },
          },
        };
      });
    },

    setQuoteWord: (quote: Quotes): void => {
      patchState(store, (state: ScoreState): ScoreState => {
        // 新しくセットするデータ
        const words: ScoreState['score']['quote']['words'] = [
          ...state.score.quote.words,
          quote,
        ];

        return {
          score: {
            ...state.score,
            quote: {
              ...state.score.quote,
              words,
            },
          },
        };
      });
    },
  }))
);
