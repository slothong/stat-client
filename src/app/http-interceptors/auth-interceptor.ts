import { AuthManager } from '@/services/auth-manager';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return inject(AuthManager).accessToken$.pipe(
    take(1),
    switchMap((accessToken) => {
      if (accessToken) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
        });
        return next(authReq);
      }
      return next(req);
    }),
  );
}
