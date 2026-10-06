import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CaptchaService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api-efafcollege.mionik.ir';

  getCaptcha(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/v1/captcha`, { responseType: 'blob' });
  }
}