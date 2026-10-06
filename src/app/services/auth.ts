import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cookie } from './cookie';




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
  private cookieService = inject(Cookie);
  private tokenCookieName = 'token';



  public login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/v1/panel/auth/login`, body);
  }

  setTokenCookie(token: string): void {
    this.cookieService.set(this.tokenCookieName, token, 5);
  }

  getTokenFromCookie(): string | null {
    return this.cookieService.get(this.tokenCookieName);
  }


  clearTokenCookie(): void {
    this.cookieService.remove(this.tokenCookieName);
  }
  getUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/v1/web/users`);
  }

}
