import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { Me } from './me';
import { toast } from 'ngx-sonner';

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
      .post<{ accessToken: string }>('/api/auth/login', {
        username: email,
        password,
      })
      .pipe(
        map((res) => res.accessToken),
        tap((accessToken) => {
          this.innerAccessToken.set(accessToken);
        })
      );
  }

  refresh() {
    this.http
      .post<{ accessToken: string }>(
        '/api/auth/refresh',
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(map((res) => res.accessToken))
      .subscribe({
        next: (accessToken) => {
          this.innerAccessToken.set(accessToken);
        },
        error: () => {
          toast('인증 실패');
        },
      });
  }

  logout() {
    this.innerAccessToken.set(null);
    this.http
      .post(
        '/api/auth/logout',
        {},
        {
          withCredentials: true,
        }
      )
      .subscribe();
  }
}
