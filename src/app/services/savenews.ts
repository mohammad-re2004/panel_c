import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Savenews {
  private http = inject(HttpClient);
  private baseUrl = 'https://api-efafcollege.mionik.ir';

  // createNews(form: FormData): Observable<any> {
  // return this.http.post<any>(`${this.baseUrl}/v1/panel/news`, form);
}

