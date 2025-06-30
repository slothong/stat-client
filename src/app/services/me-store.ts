import { effect, inject, Injectable, signal } from '@angular/core';
import { AuthManager } from './auth-manager';
import { User } from '@/models/user';
import { UserApi } from './user-api';

@Injectable({
  providedIn: 'root',
})
export class MeStore {
  private readonly userApi = inject(UserApi);

  private readonly isAuthenticated = inject(AuthManager).isAuthenticated;

  private readonly innerUser = signal<User | null>(null);

  readonly user = this.innerUser.asReadonly();

  constructor() {
    effect(() => {
      const isAuthenticated = this.isAuthenticated();
      if (isAuthenticated) {
        this.loadUser();
      } else {
        this.innerUser.set(null);
      }
    });
  }

  loadUser() {
    return this.userApi.getMe().subscribe((user) => this.innerUser.set(user));
  }
}
