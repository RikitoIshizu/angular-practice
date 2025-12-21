import { QuotesService } from '@/services/quotes.service';
import {
  FetchCurrentWeatherResponse,
  WeatherService,
} from '@/services/weather.service';
import { Title } from '@/shared/components/title/title.component';
import { Quote } from '@/types';

import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, forkJoin, of, tap } from 'rxjs';

@Component({
  selector: 'app-calendar-page',
  imports: [Title],
  templateUrl: './calendar-page.component.html',
})
export class CalendarPageComponent implements OnInit {
  quotes: Quote[] = [];
  error: string = '';
  weatherData?: FetchCurrentWeatherResponse;

  constructor(
    private quotesService: QuotesService,
    private weatherService: WeatherService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    // ローディング画面表示
    this.spinner.show();

    // 一週間の天気予報を取得するための日付計算
    const startDate = dayjs().format('YYYY-MM-DD');
    const endDate = dayjs().add(7, 'day').format('YYYY-MM-DD');

    forkJoin({
      quotes: this.quotesService.getQuotes(5),
      currentWeather: this.weatherService.getWeather(),
      weeklyWeather: this.weatherService.getWeeklyForecast(startDate, endDate),
    })
      .pipe(
        tap(({ quotes, currentWeather, weeklyWeather }) => {
          this.quotes = quotes;
          this.weatherData = currentWeather;
          this.spinner.hide();
        }),
        catchError((err) => {
          console.error('エラー詳細:', err);
          this.spinner.hide();
          this.error = 'データの取得に失敗したぜ、バカやろー。';
          return of(null);
        })
      )
      .subscribe();
  }
}
