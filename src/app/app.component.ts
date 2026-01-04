import { WeatherComponent } from '@/shared/components/weather/weather.component';
import { Quote } from '@/types';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { finalize, forkJoin } from 'rxjs';
import { FetchCurrentWeatherResponse } from './services/weather.service';
import { QuotesStore } from './stores/quotes.store';
import { WeatherStore } from './stores/weather.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    RouterLinkActive,
    NgxSpinnerModule,
    WeatherComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  // store注入
  private readonly weatherStore = inject(WeatherStore);
  private readonly quotesStore = inject(QuotesStore);

  isLoading = false;

  routings = [
    { path: '/', text: 'TODO', testId: 'nav-todo' },
    { path: '/vocabulary', text: '英単語', testId: 'nav-vocabulary' },
    { path: '/vocabulary-quiz', text: '英単語クイズ', testId: 'nav-vocabulary-quiz' },
    { path: '/quotes', text: '英語の名言', testId: 'nav-quotes' },
    { path: '/trivia', text: 'トリビア', testId: 'nav-trivia' },
  ];

  readonly weather = computed<FetchCurrentWeatherResponse | undefined>(() =>
    this.weatherStore.currentWeather?.()
  );

  readonly quotesData = computed<Quote>(() => this.quotesStore.quote());

  constructor(private spinner: NgxSpinnerService) {}

  // アクセスしたときに読み込ませておきたい
  ngOnInit() {
    this.isLoading = true;
    //ローディング画面表示
    this.spinner.show();

    // 天気データと名言データを同時に取得
    forkJoin({
      weather: this.weatherStore.setCurrentWeather(),
      quotes: this.quotesStore.setQuotes(),
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        })
      )
      .subscribe({
        error: (err) => {
          console.error('エラー詳細:', err);
        },
      });
  }
}
