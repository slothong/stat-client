import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { Me } from './me';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly innerAccessToken = signal<string | null>(null);

  readonly accessToken = this.innerAccessToken.asReadonly();

  readonly isAuthenticated = computed(() => this.innerAccessToken() != null);

  register(email: string, password: string) {
    return this.http.post('/api/auth/register', { username: email, password });
  }

  login(email: string, password: string) {
    return this.http
      .post<{ access_token: string }>('/api/auth/login', {
        username: email,
        password,
      })
      .pipe(
        map((res) => res.access_token),
        tap((accessToken) => {
          this.innerAccessToken.set(accessToken);
        })
      );
  }

  logout() {
    this.innerAccessToken.set(null);
  }
}
