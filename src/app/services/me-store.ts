import { inject, Injectable } from '@angular/core';
import { AuthManager } from './auth-manager';
import { UserApi } from './user-api';
import { of, shareReplay, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeStore {
  private readonly userApi = inject(UserApi);
  private readonly isAuthenticated$ = inject(AuthManager).isAuthenticated$;

  readonly user$ = this.isAuthenticated$.pipe(
    switchMap((auth) => (auth ? this.userApi.getMe$() : of(null))),
    shareReplay(1),
  );
}
