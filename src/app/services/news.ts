import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NewsFilter, PagedNews } from '../interfaces/news_interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {

  private http = inject(HttpClient);
  private baseUrl = 'https://api-efafcollege.mionik.ir';

  
  getAllnews(filter: NewsFilter): Observable<PagedNews> {
    return this.http.post<PagedNews>(`${this.baseUrl}/v1/panel/news/all`, filter);
  }
}
