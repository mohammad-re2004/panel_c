import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { News, NewsFilter, PagedNews } from '../interfaces/news_interface';
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

  createNews(form: FormData): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/v1/panel/news`, form);
  }

  getNews(id: string): Observable<News> {
  return this.http.get<News>(`${this.baseUrl}/v1/panel/news/${id}`);
}

updateNews(id: string, form: FormData): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/v1/panel/news/${id}`, form);
}
}
