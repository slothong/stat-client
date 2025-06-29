import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly innerAccessToken = signal<string | null>(null);

  private readonly router = inject(Router);

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
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
      });
  }
}
