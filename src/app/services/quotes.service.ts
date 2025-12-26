import { Quote } from '@/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  private readonly API_URL = '/api/japanese-quotes/json.php';

  constructor(private http: HttpClient) {}

  getQuotes(amount: number | undefined = 1): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.API_URL}?c=${amount}`).pipe(
      map((res) => res),
      catchError((error) => {
        console.error('名言の取得に失敗:', error);
        return throwError(
          () => new Error('名言の取得に失敗しました。もう一度お試しください。')
        );
      })
    );
  }
}
