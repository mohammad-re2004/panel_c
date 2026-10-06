import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(Auth).getTokenFromCookie();

  // اگه توکنی نیست (مثلاً قبل از لاگین)، دست‌نخورده ردش کن
  if (!token) {
    return next(req);
  }

  // درخواست‌ها تغییرپذیر نیستن؛ پس یه کپی با هدر جدید می‌سازیم
  return next(
    req.clone({
      setHeaders: { Authorization: token },
    })
  );
};