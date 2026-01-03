import { EnglishService } from '@/services/english.service';
import { Title } from '@/shared/components/title/title.component';
import { LearningScoreStore, ScoreState } from '@/stores/learningStatus.store';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, of, throwError } from 'rxjs';

export type Trivia = {
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
  constructor(
    private spinner: NgxSpinnerService,
    private englishService: EnglishService
  ) {}

  private readonly learningScoreState = inject(LearningScoreStore);

  error: string = '';

  trivia = signal<Trivia[]>([]);

  ngOnInit(): void {
    if (!this.learningScoreState.score.trivia.amount.gottenTrivia())
      this.getTrivia();
  }

  // トリビアを取得する
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
          this.countUp('gottenTrivia');
        })
      )
      .subscribe((response) => {
        if (!response) return;

        this.trivia.update((state) => {
          const setData = {
            id: `trivia-${state.length + 1}`,
            text: response,
          };

          this.learningScoreState.setTriviaWord(setData);

          return [...state, setData];
        });
      });
  };

  // 翻訳する
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
          this.countUp('translation');
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

  // カウントする
  countUp(key: keyof ScoreState['score']['trivia']['amount']) {
    this.learningScoreState.setTriviaAmount(key);
  }
}
