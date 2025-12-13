import { QuotesService } from '@/services/quotes.service';
import { Title } from '@/shared/components/title/title.component';
import { Quote } from '@/types';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-calendar-page',
  imports: [CommonModule, Title],
  templateUrl: './calendar-page.component.html',
})
export class CalendarPageComponent implements OnInit {
  quotes?: Observable<Quote[]>;
  error: string = '';
  loading = false;

  constructor(private quotesService: QuotesService) {}

  ngOnInit(): void {
    this.fetchQuotes(5);
  }

  fetchQuotes = (amount: number) => {
    this.error = '';
    this.loading = true;

    this.quotes = this.quotesService.getQuotes(amount).pipe(
      tap(() => {
        this.loading = false;
      }),
      catchError((err) => {
        console.error('エラー詳細:', err);
        this.loading = false;
        this.error = '名言の取得に失敗したぜ、バカやろー。';
        return of([]);
      })
    );
  };
}
