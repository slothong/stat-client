import { inject, Injectable } from '@angular/core';
import { AuthManager } from './auth-manager';
import { UserApi } from './user-api';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, shareReplay, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeStore {
  private readonly userApi = inject(UserApi);
  private readonly isAuthenticated$ = toObservable(
    inject(AuthManager).isAuthenticated,
  );

  readonly user$ = this.isAuthenticated$.pipe(
    filter((auth) => auth === true),
    switchMap(() => this.userApi.getMe$()),
    shareReplay(1),
  );
}
