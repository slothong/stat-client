import { Component, inject } from '@angular/core';
import { AuthManager } from '@/services/auth-manager';
import { MeStore } from '@/services/me-store';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AsyncPipe } from '@angular/common';
import { Avatar } from './avatar';

@Component({
  selector: 'app-header',
  imports: [
    MatButtonModule,
    RouterModule,
    MatIconModule,
    AsyncPipe,
    Avatar,
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
        <button matButton="filled" [routerLink]="['/create-poll']">
          <mat-icon>add</mat-icon>
          설문 만들기
        </button>
        <app-avatar
          [size]="40"
          [matMenuTriggerFor]="menu"
          class="cursor-pointer"
        />
        <mat-menu #menu="matMenu">
          <button mat-menu-item [routerLink]="'/users/' + user.id + '/polls'">
            프로필
          </button>
          <button mat-menu-item (click)="logout()">로그아웃</button>
        </mat-menu>
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
