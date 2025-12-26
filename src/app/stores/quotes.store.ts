import { Quote } from '@/types';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type QuotesState = {
  quote: Quote;
};

const initialState: QuotesState = {
  quote: { meigen: '', auther: '' },
};

export const QuotesStore = signalStore(
  { providedIn: 'root' },
  withState<QuotesState>(initialState),
  withMethods((store) => ({
    // 名言をセットする
    setQuotes(quote: Quote) {
      patchState(store, () => ({
        quote,
      }));
    },
  }))
);
