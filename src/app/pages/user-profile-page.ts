import { Avatar } from '@/components/ui/avatar';
import { MeStore } from '@/services/me-store';
import { UserQueries } from '@/services/user-queries';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-user-profile-page',
  imports: [AsyncPipe, RouterLink, RouterOutlet, Avatar],
  template: `
    @let me = me$ | async;
    @if (me) {
      <div class="flex items-center gap-4 mb-4">
        <app-avatar [avatarUrl]="me.avatarUrl" size="lg" />
        <div class="flex flex-col">
          <span class="text-xl">
            {{ me.username }}
          </span>
          <span class="text-sm">
            {{ me.about }}
          </span>
        </div>
      </div>
      <div role="tablist" class="tabs tabs-border mb-5">
        <a
          role="tab"
          class="tab no-underline text-inherit"
          [class.tab-active]="isActive$('polls') | async"
          [routerLink]="getTabLink$('polls') | async"
        >
          내가 작성한 설문
        </a>
        <a
          role="tab"
          class="tab no-underline text-inherit"
          [class.tab-active]="isActive$('comments') | async"
          [routerLink]="getTabLink$('comments') | async"
          >내가 쓴 댓글</a
        >
        <a
          role="tab"
          class="tab no-underline text-inherit"
          [class.tab-active]="isActive$('liked') | async"
          [routerLink]="getTabLink$('liked') | async"
        >
          좋아요 한 설문
        </a>
        <a
          role="tab"
          class="tab no-underline text-inherit"
          [class.tab-active]="isActive$('bookmark') | async"
          [routerLink]="getTabLink$('bookmark') | async"
        >
          북마크
        </a>
      </div>
      <router-outlet></router-outlet>
    }
  `,
})
export class UserProfilePage {
  private readonly userQueries = inject(UserQueries);

  // TODO: me -> user
  protected readonly me$ = this.userQueries.getMe$().pipe(map((me) => me.data));

  private readonly router = inject(Router);

  protected getTabLink$(tab: string) {
    return this.me$.pipe(
      filter((me) => !!me),
      map((me) => `/users/${me.id}/profile/${tab}`),
    );
  }

  isActive$(tab: string) {
    return this.getTabLink$(tab).pipe(
      map((path) =>
        this.router.isActive(path, {
          paths: 'subset',
          queryParams: 'ignored',
          fragment: 'ignored',
          matrixParams: 'ignored',
        }),
      ),
    );
  }
}
