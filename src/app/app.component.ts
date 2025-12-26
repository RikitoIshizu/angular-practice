import { QuotesService } from '@/services/quotes.service';
import { WeatherComponent } from '@/shared/components/weather/weather.component';
import { Quote } from '@/types';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import {
  FetchCurrentWeatherResponse,
  WeatherService,
} from './services/weather.service';
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
    { path: '/', text: 'TODO' },
    { path: '/vocabulary/', text: '英単語' },
    { path: '/vocabulary-quiz/', text: '英単語クイズ' },
  ];

  readonly weather = computed<FetchCurrentWeatherResponse | undefined>(() =>
    this.weatherStore.currentWeather?.()
  );

  readonly quotesData = computed<Quote>(() => this.quotesStore.quote());

  constructor(
    private quotesService: QuotesService,
    private weatherService: WeatherService,
    private spinner: NgxSpinnerService
  ) {}

  // アクセスしたときに読み込ませておきたい
  ngOnInit() {
    this.isLoading = true;
    //ローディング画面表示
    this.spinner.show();
    // アプリ起動時に共通データを取得
    forkJoin({
      weather: this.weatherService.getWeather(),
      quotes: this.quotesService.getQuotes(1),
    }).subscribe({
      next: ({ weather, quotes }) => {
        // 天気データをストアに保存
        this.weatherStore.setCurrentWeather(weather);
        this.quotesStore.setQuotes(quotes[0]);

        this.isLoading = false;

        //ローディング画面非表示
        this.spinner.hide();
      },
      error: (err) => {
        console.error('エラー詳細:', err);
        this.isLoading = false;
        this.spinner.hide();
      },
    });

    // ルート変更時にも共通データを更新（必要に応じて）
    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     // 必要に応じて共通データを再取得
    //     // this.loadCommonData();
    //   });
  }
}
