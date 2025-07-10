import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, ReplaySubject, shareReplay, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthApi } from './auth-api';

@Injectable({
  providedIn: 'root',
})
export class AuthManager {
  private readonly authApi = inject(AuthApi);

  private readonly router = inject(Router);

  private readonly innerAccessToken$ = new BehaviorSubject<string | null>(null); // new ReplaySubject<string | null>(1);

  readonly accessToken$ = this.innerAccessToken$.asObservable();

  readonly isAuthenticated$ = this.accessToken$.pipe(map((token) => !!token));

  register$(email: string, password: string, birth: Date, gender: string) {
    return this.authApi.register$(email, password, birth, gender);
  }

  login$(email: string, password: string) {
    return this.authApi
      .login$(email, password)
      .pipe(tap((accessToken) => this.innerAccessToken$.next(accessToken)));
  }

  refresh$() {
    return this.authApi
      .refresh$()
      .pipe(tap((accessToken) => this.innerAccessToken$.next(accessToken)));
  }

  logout$() {
    return this.authApi.logout$().pipe(
      tap(() => {
        this.innerAccessToken$.next(null);
        this.router.navigate(['']);
      }),
    );
  }
}
