import { EnglishService } from '@/services/english.service';
import { Title } from '@/shared/components/title/title.component';
import { LearningScoreStore } from '@/stores/learningStatus.store';
import { GetEnglishQuotes } from '@/types';
import { Component, inject, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, throwError } from 'rxjs';

type Quotes = GetEnglishQuotes & {
  translation?: string;
};

@Component({
  selector: 'app-quotes',
  imports: [Title],
  templateUrl: './quotes.component.html',
})
export class QuotesComponent {
  private readonly learningScoreState = inject(LearningScoreStore);

  constructor(
    private spinner: NgxSpinnerService,
    private englishService: EnglishService
  ) {}

  quotes = signal<Quotes[]>([]);

  fetchData = (): void => {
    this.spinner.show();

    const exceptNumbers = this.quotes().map((el) => el.id);

    this.englishService
      .getEnglishQuotes(exceptNumbers)
      .pipe(
        catchError((error) => {
          console.error('単語の取得に失敗:', error);
          return throwError(
            () =>
              new Error('単語の取得に失敗しました。もう一度お試しください。')
          );
        }),
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((response) => {
        this.learningScoreState.setQuotesAmount();
        this.learningScoreState.setQuoteWord(response);
        this.quotes.update((state) => {
          return [...state, response];
        });
      });
  };

  fetchTranslation = (
    id: GetEnglishQuotes['id'],
    quote: GetEnglishQuotes['quote']
  ): void => {
    this.spinner.show();

    this.englishService
      .getTranslateWord(quote)
      .pipe(
        catchError((error) => {
          this.spinner.hide();

          console.error('翻訳の取得に失敗:', error);
          return throwError(
            () =>
              new Error('単語の取得に失敗しました。もう一度お試しください。')
          );
        }),
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((response) => {
        this.quotes.update((state) => {
          return state.map((quote) => {
            const settingData: Quotes = { ...quote };
            if (quote.id === id) {
              settingData.translation = response;
            }

            return settingData;
          });
        });
      });
  };
}
