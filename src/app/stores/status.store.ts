import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type ScoreState = {
  score: {
    vocabulary: {
      translation: number;
      searchingWords: number;
    };
    quote: {
      translation: number;
    };
    trivia: {
      translation: number;
    };
    quiz: {
      translation: number;
    };
  };
};

type StoreKey = keyof ScoreState['score'];

const initialState: ScoreState = {
  score: {
    vocabulary: {
      translation: 0,
      searchingWords: 0,
    },
    quote: {
      translation: 0,
    },
    trivia: {
      translation: 0,
    },
    quiz: {
      translation: 0,
    },
  },
};

export const ScoreStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    // 学習状況をリセットする
    reset: (): void => {
      patchState(store, initialState);
    },
    // 翻訳をしたら、カウントアップする
    useTranslation: (key: StoreKey): void => {
      patchState(store, (state: ScoreState) => {
        // セットするデータを使う
        const settingData = {
          [key]: {
            ...state.score[key],
            translate: state.score[key].translation + 1,
          },
        };

        return {
          score: {
            ...state.score,
            ...settingData,
          },
        };
      });
    },
  }))
);
