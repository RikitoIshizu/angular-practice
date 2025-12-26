import { FetchCurrentWeatherResponse } from '@/services/weather.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'weather-component',
  standalone: true,
  imports: [],
  templateUrl: './weather.component.html',
  styles: ``,
})
export class WeatherComponent {
  @Input() weatherData?: FetchCurrentWeatherResponse;

  /**
   * WMO Weather Code から適切な天気アイコンのパスを返す
   * @param weatherCode WMO天気コード
   * @returns SVGアイコンのパス
   */
  getWeatherIconPath = (
    weatherCode: FetchCurrentWeatherResponse['weatherCode']
  ): string => {
    const baseUrl = '/icons/weather';

    if (weatherCode === 0) return `${baseUrl}/clearSky.svg`; // 快晴

    if (weatherCode === 3 || [45, 48, 51, 53, 55, 56, 57].includes(weatherCode))
      return `${baseUrl}/cloudy.svg`; //曇り

    if ([1, 2].includes(weatherCode)) return `${baseUrl}/sunny.svg`; // 晴れ

    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode))
      return `${baseUrl}/rainy.svg`; // 雨

    if ([71, 73, 75, 77, 85, 86].includes(weatherCode))
      return `${baseUrl}/snowy.svg`;

    if ([95, 96, 99].includes(weatherCode)) return `${baseUrl}/thunder.svg`; // 雷雨

    // デフォルトは曇り
    return `${baseUrl}/cloudy.svg`;
  };
}
