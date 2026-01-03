import { EnglishService } from '@/services/english.service';
import { Title } from '@/shared/components/title/title.component';
import { AlphabetLetter, GetEnglishWordsPayload } from '@/types';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, throwError } from 'rxjs';

@Component({
  selector: 'app-vocabulary-quiz-page',
  imports: [Title, FormsModule],
  templateUrl: './vocabulary-quiz-page.component.html',
})
export class VocabularyQuizPageComponent {
  constructor(
    private spinner: NgxSpinnerService,
    private englishService: EnglishService
  ) {}

  error: string = '';

  words = signal<string[]>([]);

  // 入力項目
  formItem: GetEnglishWordsPayload = {
    words: '3',
    length: '',
    letter: '',
  };

  // 頭文字の選択肢
  readonly initials: {
    key: AlphabetLetter | '';
    value: AlphabetLetter | '-';
  }[] = [
    { key: '', value: '-' },
    { key: 'a', value: 'a' },
    { key: 'b', value: 'b' },
    { key: 'c', value: 'c' },
    { key: 'd', value: 'd' },
    { key: 'e', value: 'e' },
    { key: 'f', value: 'f' },
    { key: 'g', value: 'g' },
    { key: 'h', value: 'h' },
    { key: 'i', value: 'i' },
    { key: 'j', value: 'j' },
    { key: 'k', value: 'k' },
    { key: 'l', value: 'l' },
    { key: 'm', value: 'm' },
    { key: 'n', value: 'n' },
    { key: 'o', value: 'o' },
    { key: 'p', value: 'p' },
    { key: 'q', value: 'q' },
    { key: 'r', value: 'r' },
    { key: 's', value: 's' },
    { key: 't', value: 't' },
    { key: 'u', value: 'u' },
    { key: 'v', value: 'v' },
    { key: 'w', value: 'w' },
    { key: 'x', value: 'x' },
    { key: 'y', value: 'y' },
    { key: 'z', value: 'z' },
  ];

  // 数字の選択肢（1～9）
  readonly wordLengthItems: {
    key: string;
    value: string;
  }[] = [
    { key: '', value: '未選択' },
    { key: '3', value: '3' },
    { key: '4', value: '4' },
    { key: '5', value: '5' },
    { key: '6', value: '6' },
    { key: '7', value: '7' },
    { key: '8', value: '8' },
    { key: '9', value: '9' },
  ];

  fetchData = (): void => {
    this.spinner.show();

    this.englishService
      .getEnglishWords(this.formItem)
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
      .subscribe((response) => this.words.set(response));
  };
}
