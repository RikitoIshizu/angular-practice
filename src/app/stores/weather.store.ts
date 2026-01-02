import {
  FetchCurrentWeatherResponse,
  WeatherService,
} from '@/services/weather.service';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { catchError, map, Observable, throwError } from 'rxjs';

export type WeatherState = {
  currentWeather?: FetchCurrentWeatherResponse;
};

const initialState: { currentWeather?: FetchCurrentWeatherResponse } = {
  currentWeather: undefined,
};

export const WeatherStore = signalStore(
  { providedIn: 'root' },
  withState<WeatherState>(initialState),
  withMethods((store, weatherService = inject(WeatherService)) => ({
    // 現在の天気を取得する
    setCurrentWeather: (): Observable<void> => {
      return weatherService.getWeather().pipe(
        map((state) => {
          patchState(store, () => ({
            currentWeather: state,
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
