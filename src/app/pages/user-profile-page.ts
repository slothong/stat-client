import { MeStore } from '@/services/me-store';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { filter, map } from 'rxjs';
import { UserProfilePollsPage } from './user-profile-polls-page';
import { UserProfileCommentsPage } from './user-profile-comments-page';
import { UserProfileLikedPage } from './user-profile-liked-page';
import { UserProfileBookmarkPage } from './user-profile-bookmark-page';

@Component({
  selector: 'app-user-profile-page',
  imports: [
    AsyncPipe,
    RouterLink,
    NzAvatarModule,
    NzTabsModule,
    UserProfilePollsPage,
    UserProfileCommentsPage,
    UserProfileLikedPage,
    UserProfileBookmarkPage,
  ],
  template: `
    @let me = me$ | async;
    @if (me) {
      <div class="w-6xl mx-auto">
        <div class="flex items-center gap-4 mb-4 pt-5">
          <nz-avatar
            nzIcon="user"
            nz-dropdown
            nzTrigger="click"
            class="cursor-pointer"
            nzSize="large"
          ></nz-avatar>
          <span class="text-xl font-bold">
            {{ me.username }}
          </span>
        </div>
        <nz-tabs nzLinkRouter>
          <nz-tab>
            <a
              *nzTabLink
              nz-tab-link
              [routerLink]="getTabLink$('polls') | async"
            >
              내가 작성한 설문
            </a>
            <app-user-profile-polls-page />
          </nz-tab>
          <nz-tab>
            <a
              *nzTabLink
              nz-tab-link
              [routerLink]="getTabLink$('comments') | async"
            >
              내가 쓴 댓글
            </a>
            <app-user-profile-comments-page />
          </nz-tab>
          <nz-tab>
            <a
              *nzTabLink
              nz-tab-link
              [routerLink]="getTabLink$('liked') | async"
            >
              좋아요 한 설문
            </a>
            <app-user-profile-liked-page />
          </nz-tab>
          <nz-tab>
            <a
              *nzTabLink
              nz-tab-link
              [routerLink]="getTabLink$('bookmark') | async"
            >
              북마크 한 설문
            </a>
            <app-user-profile-bookmark-page />
          </nz-tab>
        </nz-tabs>
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
