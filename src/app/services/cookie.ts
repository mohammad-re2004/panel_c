import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Cookie {
   set(name: string, value: string, days = 5): void {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/`;
  }

  get(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  }

  remove(name: string): void {
    document.cookie = `${name}=; max-age=0; path=/`;
  }
}
