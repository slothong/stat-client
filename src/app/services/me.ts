import { effect, inject, Injectable, signal } from '@angular/core';
import { Auth } from './auth';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '@/models/user-dto';
import { User } from '@/models/user';

@Injectable({
  providedIn: 'root',
})
export class Me {
  private readonly http = inject(HttpClient);

  private readonly isAuthenticated = inject(Auth).isAuthenticated;

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
    return this.http.get<UserDto>('/api/users/me').subscribe((userDto) => {
      this.innerUser.set(User.fromDto(userDto));
    });
  }
}
