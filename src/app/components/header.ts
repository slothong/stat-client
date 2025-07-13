import { Component, inject } from '@angular/core';
import { AuthManager } from '@/services/auth-manager';
import { MeStore } from '@/services/me-store';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AsyncPipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-header',
  imports: [
    MatButtonModule,
    RouterModule,
    MatIconModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    AsyncPipe,
    NzAvatarModule,
    MatMenuModule,
  ],
  host: {
    class: 'flex justify-between items-center py-3 px-5',
  },
  template: `
    <a routerLink="/">로고</a>
    <div class="flex items-center gap-3">
      @let user = me$ | async;
      @if (user) {
        <button
          nz-button
          nzType="primary"
          nzShape="round"
          [routerLink]="['/create-poll']"
        >
          <nz-icon nzType="plus" />
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
              [routerLink]="'/users/' + user.id + '/polls'"
              [nzMatchRouter]="false"
            >
              프로필
            </li>
            <li nz-menu-item (click)="logout()">로그아웃</li>
          </ul>
        </nz-dropdown-menu>
        <!-- <app-avatar
          [size]="40"
          [matMenuTriggerFor]="menu"
          class="cursor-pointer"
        />
        <mat-menu #menu="matMenu">
          <button mat-menu-item [routerLink]="'/users/' + user.id + '/polls'">
            프로필
          </button>
          <button mat-menu-item (click)="logout()">로그아웃</button>
        </mat-menu> -->
      } @else {
        <button matButton="filled" routerLink="/login">로그인</button>
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
