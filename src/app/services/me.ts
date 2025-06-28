import { effect, inject, Injectable, signal } from '@angular/core';
import { Auth } from './auth';
import { HttpClient } from '@angular/common/http';

type User = {
  id: string;
  username: string;
};

@Injectable({
  providedIn: 'root',
})
export class Me {
  private readonly http = inject(HttpClient);

  private readonly isAuthenticated = inject(Auth).isAuthenticated;

  private readonly innerMe = signal<User | null>(null);

  readonly me = this.innerMe.asReadonly();

  constructor() {
    effect(() => {
      const isAuthenticated = this.isAuthenticated();
      if (isAuthenticated) {
        this.loadMe();
      } else {
        this.innerMe.set(null);
      }
    });
  }

  loadMe() {
    return this.http
      .get<{ userid: string; username: string }>('/api/users/me')
      .subscribe((res) => {
        this.innerMe.set({
          id: res.userid,
          username: res.username,
        });
      });
  }
}
