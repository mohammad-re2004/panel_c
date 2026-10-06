import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';




export interface LoginRequest {
  username: string;
  password: string;
  captcha: string;
}

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private baseUrl = 'https://api-efafcollege.mionik.ir';


  public login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/v1/panel/auth/login`, body);
  }

  setTokenCookie(token: string, days = 5): void {
    const maxAge = days * 24 * 60 * 60;   // ۵ روز به ثانیه
    document.cookie = `token=${encodeURIComponent(token)}; max-age=${maxAge}; path=/`;
  }

  getTokenFromCookie(): string | null {
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
  }

  clearTokenCookie(): void {
    document.cookie = 'token=; max-age=0; path=/';
  }

  getUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/v1/web/users`);
  }

}
