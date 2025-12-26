import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

// 型の生成方法がないから、手動で定義
type RawWeatherApiResponse = {
  latitude?: number;
  longitude?: number;
  generationtime_ms?: number;
  utc_offset_seconds?: number;
  timezone?: string;
  timezone_abbreviation?: string;
  elevation?: number;
  current_units?: {
    time?: string;
    interval?: string;
    apparent_temperature?: string;
    precipitation?: string;
    rain?: string;
    weather_code?: string;
    is_day?: string;
    pressure_msl?: string;
    surface_pressure?: string;
    cloud_cover?: string;
    showers?: string;
    snowfall?: string;
  };
  current?: {
    time?: string;
    interval?: number;
    apparent_temperature?: number;
    precipitation?: number;
    rain?: number;
    weather_code?: number;
    is_day?: number;
    pressure_msl?: number;
    surface_pressure?: number;
    cloud_cover?: number;
    showers?: number;
    snowfall?: number;
    relative_humidity_2m?: number;
  };
  daily?: {
    apparent_temperature_max?: number[];
    apparent_temperature_min?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    time?: string[];
    weather_code?: number[];
  };
  daily_units?: {
    apparent_temperature_max?: string;
    apparent_temperature_min?: string;
    temperature_2m_max?: string;
    temperature_2m_min?: string;
    time?: string;
    weather_code?: string;
  };
};

type CurrentWeather = NonNullable<RawWeatherApiResponse['current']>;

export type FetchCurrentWeatherResponse = {
  temperature: NonNullable<CurrentWeather['apparent_temperature']>;
  relativeHumidity: NonNullable<CurrentWeather['relative_humidity_2m']>;
  precipitation: NonNullable<CurrentWeather['precipitation']>;
  rain: NonNullable<CurrentWeather['rain']>;
  is_day: NonNullable<CurrentWeather['is_day']>;
  weatherCode: NonNullable<CurrentWeather['weather_code']>;
};

type DailyWeather = NonNullable<RawWeatherApiResponse['daily']>;

export type FetchWeeklyWeatherResponse = {
  date: NonNullable<DailyWeather['time']>[number];
  weatherCode: NonNullable<DailyWeather['weather_code']>[number];
  temperature2mMax: NonNullable<DailyWeather['temperature_2m_max']>[number];
  temperature2mMin: NonNullable<DailyWeather['temperature_2m_min']>[number];
  apparentTemperatureMax: NonNullable<
    DailyWeather['apparent_temperature_max']
  >[number];
  apparentTemperatureMin: NonNullable<
    DailyWeather['apparent_temperature_min']
  >[number];
}[];

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly API_URL = '/api/weather';
  private readonly LATITUDE = 35.68;
  private readonly LONGITUDE = 139.76;

  constructor(private http: HttpClient) {}

  makeWeatherQueryParams(params: { [key: string]: any }): string {
    let query = '';

    Object.entries(params).map(([key, value]) => {
      if (query.length > 0) {
        query += '&';
      }

      query += `${key}=${value}`;
    });

    return query;
  }

  getWeather(): Observable<FetchCurrentWeatherResponse> {
    const params = {
      latitude: this.LATITUDE,
      longitude: this.LONGITUDE,
      current: [
        'apparent_temperature',
        'relative_humidity_2m',
        'precipitation',
        'rain',
        'weather_code',
        'is_day',
      ],
      models: 'jma_seamless',
      forecast_days: 1,
    };

    return this.http
      .get<RawWeatherApiResponse>(
        `${this.API_URL}?${this.makeWeatherQueryParams(params)}`
      )
      .pipe(
        map((res) => {
          const current: RawWeatherApiResponse['current'] = res.current;

          if (!current) {
            throw new Error(
              '多分、天気データのAPIレスポンスに障害があったかも。'
            );
          }

          const weatherCode = current.weather_code || 0;

          const data: FetchCurrentWeatherResponse = {
            temperature: current.apparent_temperature || 0,
            relativeHumidity: current.relative_humidity_2m || 0,
            precipitation: current.precipitation || 0,
            rain: current.rain || 0,
            is_day: current.is_day || 0,
            weatherCode,
          };

          return data;
        }),
        catchError((error) => {
          console.error('天気情報の取得に失敗:', error);
          return throwError(
            () =>
              new Error(
                '天気情報の取得に失敗しました。もう一度お試しください。'
              )
          );
        })
      );
  }

  getWeeklyForecast(
    start_date: string,
    end_date: string
  ): Observable<FetchWeeklyWeatherResponse> {
    const params = {
      latitude: this.LATITUDE,
      longitude: this.LONGITUDE,
      start_date,
      end_date,
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
      ],
    };

    return this.http
      .get<RawWeatherApiResponse>(
        `${this.API_URL}?${this.makeWeatherQueryParams(params)}`
      )
      .pipe(
        map((res) => {
          if (!res.daily) {
            throw new Error(
              '多分、天気データのAPIレスポンスに障害があったかも。'
            );
          }

          const {
            time,
            weather_code,
            temperature_2m_max,
            temperature_2m_min,
            apparent_temperature_max,
            apparent_temperature_min,
          } = res.daily;

          const response: FetchWeeklyWeatherResponse =
            time?.map((date, index) => {
              return {
                date,
                weatherCode: weather_code?.[index] || 0,
                temperature2mMax: temperature_2m_max?.[index] || 0,
                temperature2mMin: temperature_2m_min?.[index] || 0,
                apparentTemperatureMax: apparent_temperature_max?.[index] || 0,
                apparentTemperatureMin: apparent_temperature_min?.[index] || 0,
              };
            }) || [];

          return response;
        }),
        catchError((error) => {
          console.error('週間天気予報の取得に失敗:', error);
          return throwError(
            () =>
              new Error(
                '週間天気予報の取得に失敗しました。もう一度お試しください。'
              )
          );
        })
      );
  }
}
