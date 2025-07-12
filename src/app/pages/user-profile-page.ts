import { MeStore } from '@/services/me-store';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-user-profile-page',
  imports: [AsyncPipe, MatCardModule, MatTabsModule, RouterOutlet, RouterLink],
  template: `
    @let me = me$ | async;
    @if (me) {
      <div class="w-6xl mx-auto">
        Hi, {{ me?.username }}
        <nav mat-tab-nav-bar [tabPanel]="tabPanel">
          <a
            mat-tab-link
            [routerLink]="getTabLink$('polls') | async"
            [active]="isActive(getTabLink$('polls') | async)"
            class="grow-0! min-w-36!"
          >
            내가 작성한 설문
          </a>
          <a
            mat-tab-link
            [routerLink]="getTabLink$('comments') | async"
            [active]="isActive(getTabLink$('comments') | async)"
            class="grow-0! min-w-36!"
          >
            내가 쓴 댓글
          </a>
          <a
            mat-tab-link
            [routerLink]="getTabLink$('liked') | async"
            [active]="isActive(getTabLink$('liked') | async)"
            class="grow-0! min-w-36!"
          >
            좋아요 한 설문
          </a>
          <a
            mat-tab-link
            [routerLink]="getTabLink$('bookmark') | async"
            [active]="isActive(getTabLink$('bookmark') | async)"
            class="grow-0! min-w-36!"
          >
            북마크
          </a>
        </nav>
        <mat-tab-nav-panel #tabPanel>
          <router-outlet></router-outlet>
        </mat-tab-nav-panel>
      </div>
    }
  `,
})
export class UserProfilePage {
  protected readonly me$ = inject(MeStore).user$;

  private readonly router = inject(Router);

  protected getTabLink$(tab: string) {
    return this.me$.pipe(
      filter((me) => !!me),
      map((me) => `/users/${me.id}/${tab}`),
    );
  }

  isActive(path: string | null) {
    if (!path) return false;
    return this.router.isActive(path, {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
