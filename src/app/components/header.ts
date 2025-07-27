import { Component, inject } from '@angular/core';
import { AuthManager } from '@/services/auth-manager';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { UserQueries } from '@/services/user-queries';
import { map } from 'rxjs';
import { Avatar } from './ui/avatar';

@Component({
  selector: 'app-header',
  imports: [NgIcon, RouterModule, AsyncPipe, Avatar],
  host: {
    class: 'flex justify-between items-center py-3 px-5',
  },
  template: `
    @let me = me$ | async;

    <a routerLink="/">로고</a>

    <label class="input w-xl">
      <ng-icon name="lucideSearch" />
      <input type="search" required placeholder="Search" />
    </label>

    <div class="flex items-center gap-3">
      @let user = me$ | async;
      @if (user) {
        <button class="btn btn-ghost" routerLink="/create-poll">
          <ng-icon name="lucidePlus" size="16" />
          설문 만들기
        </button>
        <div class="dropdown dropdown-end">
          <app-avatar role="button" tabindex="0" [avatarUrl]="me?.avatarUrl" />
          <ul
            tabindex="0"
            class="menu dropdown-content bg-base-100 rounded-box z-1 w-26 p-2 shadow-sm"
          >
            <li>
              <a
                [routerLink]="'/users/' + user.id + '/profile/polls'"
                class="text-inherit no-underline"
              >
                프로필
              </a>
            </li>
            <li>
              <a
                [routerLink]="'/users/' + user.id + '/settings'"
                class="text-inherit no-underline"
              >
                설정
              </a>
            </li>
            <li>
              <a (click)="logout()">로그아웃</a>
            </li>
          </ul>
        </div>
      } @else {
        <button class="btn btn-primary" routerLink="/login">로그인</button>
      }
    </div>
  `,
})
export class Header {
  private readonly auth = inject(AuthManager);

  private readonly userQueries = inject(UserQueries);

  protected readonly me$ = this.userQueries.getMe$().pipe(map((me) => me.data));

  private readonly router = inject(Router);

  protected logout() {
    this.auth.logout$().subscribe({
      next: () => this.router.navigate(['/']),
    });
  }
}
