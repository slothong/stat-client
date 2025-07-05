import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthApi } from './auth-api';

@Injectable({
  providedIn: 'root',
})
export class AuthManager {
  private readonly authApi = inject(AuthApi);

  private readonly innerAccessToken = signal<string | null>(null);

  private readonly router = inject(Router);

  readonly accessToken = this.innerAccessToken.asReadonly();

  readonly isAuthenticated = computed(() => this.innerAccessToken() != null);

  register(email: string, password: string, birth: Date, gender: string) {
    return this.authApi.register(email, password, birth, gender);
  }

  login(email: string, password: string) {
    return this.authApi
      .login(email, password)
      .pipe(tap((accessToken) => this.innerAccessToken.set(accessToken)));
  }

  refresh() {
    return this.authApi
      .refresh()
      .pipe(tap((accessToken) => this.innerAccessToken.set(accessToken)));
  }

  logout() {
    this.innerAccessToken.set(null);
    this.authApi.logout().subscribe({
      next: () => {
        this.router.navigate(['']);
      },
    });
  }
}
