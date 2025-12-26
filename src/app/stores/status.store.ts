import { signalStore, withMethods, withState } from '@ngrx/signals';

export type ScoreState = {
  score: {
    vocabulary: {};
    quiz: {};
  };
};

const initialState = {
  score: {
    vocabulary: {},
    quiz: {},
  },
};

export const ScoreStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    // set
  }))
);
