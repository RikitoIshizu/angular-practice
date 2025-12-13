import { Quote } from '@/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  private readonly API_URL = '/quotes/json.php';

  constructor(private http: HttpClient) {}

  getQuotes(amount: number | undefined = 1): Observable<Quote[]> {
    return this.http
      .get<Quote[]>(`${this.API_URL}?c=${amount}`)
      .pipe(map((res) => res));
  }
}
