import { Injectable } from '@angular/core';

const API_URL = 'https://api.open-meteo.com/v1/forecast';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor() {}
}
