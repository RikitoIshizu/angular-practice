import { EnglishService } from '@/services/english.service';
import { Title } from '@/shared/components/title/title.component';
import { Component, OnInit, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, of, throwError } from 'rxjs';

type Trivia = {
  id: string;
  text: string;
  translation?: string;
};

@Component({
  selector: 'app-trivia',
  imports: [Title],
  templateUrl: './trivia.component.html',
})
export class TriviaComponent implements OnInit {
  error: string = '';

  trivia = signal<Trivia[]>([]);

  constructor(
    private spinner: NgxSpinnerService,
    private englishService: EnglishService
  ) {}

  ngOnInit() {
    this.getTrivia();
  }

  getTrivia = (): void => {
    this.spinner.show();

    this.englishService
      .getTrivia()
      .pipe(
        catchError((error) => {
          console.error('エラー:', error);
          this.error = error.message;
          return of('');
        }),
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((response) => {
        if (!response) return;

        this.trivia.update((state) => {
          const setData = {
            id: `trivia-${state.length + 1}`,
            text: response,
          };
          return [...state, setData];
        });
      });
  };

  fetchTranslation = (id: Trivia['id'], text: Trivia['text']): void => {
    this.spinner.show();

    this.englishService
      .getTranslateWord(text)
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
        this.trivia.update((state) => {
          return state.map((trivia) => {
            const settingData = { ...trivia };

            if (trivia.id === id) {
              settingData.translation = response;
            }

            return settingData;
          });
        });
      });
  };
}
