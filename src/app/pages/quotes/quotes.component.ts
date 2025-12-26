import { EnglishService } from '@/services/english.service';
import { Title } from '@/shared/components/title/title.component';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, throwError } from 'rxjs';

@Component({
  selector: 'app-quotes',
  imports: [Title],
  templateUrl: './quotes.component.html',
})
export class QuotesComponent {
  constructor(
    private spinner: NgxSpinnerService,
    private englishService: EnglishService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData = (): void => {
    this.spinner.show();

    this.englishService
      .getEnglishQuotes()
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
        console.log(response);
      });
  };
}
