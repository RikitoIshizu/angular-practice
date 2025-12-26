import { FetchCurrentWeatherResponse } from '@/services/weather.service';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type WeatherState = {
  currentWeather?: FetchCurrentWeatherResponse;
};

const initialState: { currentWeather?: FetchCurrentWeatherResponse } = {
  currentWeather: undefined,
};

export const WeatherStore = signalStore(
  { providedIn: 'root' },
  withState<WeatherState>(initialState),
  withMethods((store) => ({
    // 現在の天気情報を設定する
    setCurrentWeather(state: FetchCurrentWeatherResponse) {
      patchState(store, () => ({
        currentWeather: state,
      }));
    },
  }))
);
