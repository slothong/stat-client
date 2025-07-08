import { Component, inject } from '@angular/core';
import { AuthManager } from '@/services/auth-manager';
import { MeStore } from '@/services/me-store';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [
    MatButtonModule,
    RouterLink,
    NzButtonModule,
    NzFlexModule,
    NzSpaceModule,
    MatIconModule,
  ],
  host: {
    class: 'flex justify-between items-center h-20',
  },
  template: `
    <a routerLink="/">로고</a>
    <div class="flex items-center gap-3">
      @let user = me(); @if (user) {
      <span>Hi, {{ user.username }}!</span>
      <button matButton="filled" routerLink="/create-poll">
        <mat-icon>add</mat-icon>
        설문 만들기
      </button>
      <button matButton (click)="logout()">로그아웃</button>
      } @else {
      <button matButton="filled" routerLink="/login">로그인</button>
      }
    </div>
  `,
})
export class Header {
  private readonly auth = inject(AuthManager);

  protected readonly me = inject(MeStore).user;

  protected readonly isAuthenticated = inject(AuthManager).isAuthenticated;

  protected logout() {
    this.auth.logout();
  }
}
