import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly http = inject(HttpClient);

  register(email: string, password: string) {
    return this.http.post('/api/auth/register', { username: email, password });
  }

  login(email: string, password: string) {
    return this.http
      .post<{ accessToken: string }>('/api/auth/login', {
        username: email,
        password,
      })
      .pipe(map((res) => res.accessToken));
  }

  refresh() {
    return this.http
      .post<{ accessToken: string }>('/api/auth/refresh', {})
      .pipe(map((res) => res.accessToken));
  }

  logout() {
    return this.http.post('/api/auth/logout', {});
  }
}
