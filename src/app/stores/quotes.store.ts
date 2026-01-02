import { QuotesService } from '@/services/quotes.service';
import { Quote } from '@/types';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { catchError, map, Observable, throwError } from 'rxjs';

export type QuotesState = {
  quote: Quote;
};

const initialState: QuotesState = {
  quote: { meigen: '', auther: '' },
};

export const QuotesStore = signalStore(
  { providedIn: 'root' },
  withState<QuotesState>(initialState),
  withMethods((store, quoteService = inject(QuotesService)) => ({
    // 名言をセットする
    setQuotes: (): Observable<void> => {
      return quoteService.getQuotes(1).pipe(
        map((state) => {
          patchState(store, () => ({
            quote: state[0],
          }));
        }),
        catchError((error) => {
          console.error('エラー詳細:', error);
          return throwError(() => error);
        })
      );
    },
  }))
);
