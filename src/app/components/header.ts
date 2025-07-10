import { Component, inject } from '@angular/core';
import { AuthManager } from '@/services/auth-manager';
import { MeStore } from '@/services/me-store';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, RouterLink, MatIconModule, AsyncPipe],
  host: {
    class: 'flex justify-between items-center h-20',
  },
  template: `
    <a routerLink="/">로고</a>
    <div class="flex items-center gap-3">
      @let user = me$ | async;
      @if (user) {
        <span [routerLink]="'/users/' + user.id">Hi, {{ user.username }}!</span>
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

  protected readonly me$ = inject(MeStore).user$;

  private readonly router = inject(Router);

  protected logout() {
    this.auth.logout$().subscribe({
      next: () => this.router.navigate(['/']),
    });
  }
}
