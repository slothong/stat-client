import { PollCard } from '@/components/poll-card';
import { PollQueries } from '@/services/poll-queries';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-profile-bookmark-page',
  imports: [AsyncPipe, PollCard],
  template: `
    @let polls = (polls$ | async)?.data;
    @for (poll of polls; track poll.id) {
      <app-poll-card [poll]="poll" />
    }
  `,
})
export class UserProfileBookmarkPage {
  protected readonly userId$ = inject(ActivatedRoute).paramMap.pipe(
    map((p) => p.get('id')),
  );

  protected readonly pollQueries = inject(PollQueries);

  protected readonly polls$ = this.userId$?.pipe(
    filter((userId) => userId != null),
    switchMap((userId) => this.pollQueries.getBookmarkedPolls$(userId)),
  );
}
