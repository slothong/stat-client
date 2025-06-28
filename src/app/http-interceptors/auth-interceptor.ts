import { Auth } from '@/services/auth';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const accessToken = inject(Auth).accessToken();

  if (accessToken) {
    return next(
      req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      })
    );
  }
  return next(req);
}
