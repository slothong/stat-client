import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_API_URL = 'http://localhost:3000';

export function baseUrlInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const clonedReq = req.clone({
    url: BASE_API_URL + req.url,
  });
  return next(clonedReq);
}
