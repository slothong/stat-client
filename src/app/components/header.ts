import { Component, inject } from '@angular/core';
import { AuthManager } from '@/services/auth-manager';
import { MeStore } from '@/services/me-store';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-header',
  imports: [
    NgIcon,
    RouterModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzMenuModule,
    AsyncPipe,
    NzAvatarModule,
  ],
  host: {
    class: 'flex justify-between items-center py-3 px-5',
  },
  template: `
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

        <nz-avatar
          nzIcon="user"
          nz-dropdown
          [nzDropdownMenu]="menu"
          nzTrigger="click"
          class="cursor-pointer"
        ></nz-avatar>

        <nz-dropdown-menu #menu="nzDropdownMenu">
          <ul nz-menu nzSelectable>
            <li
              nz-menu-item
              [routerLink]="'/users/' + user.id + '/profile/polls'"
              [nzMatchRouter]="false"
            >
              프로필
            </li>
            <li nz-menu-item [routerLink]="'/users/' + user.id + '/settings'">
              설정
            </li>
            <li nz-menu-item (click)="logout()">로그아웃</li>
          </ul>
        </nz-dropdown-menu>
      } @else {
        <button nz-button nzType="primary" nzShape="round" routerLink="/login">
          로그인
        </button>
      }
    </div>
  `,
})
export class Header {
  private readonly auth = inject(AuthManager);

  protected readonly me$ = inject(MeStore).user$;

  private readonly router = inject(Router);

  protected logout() {
    this.auth.logout$().subscribe({
      next: () => this.router.navigate(['/']),
    });
  }
}
