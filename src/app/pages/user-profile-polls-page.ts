import { PollCard } from '@/components/poll-card';
import { PollQueries } from '@/services/poll-queries';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-profile-polls-page',
  imports: [PollCard, AsyncPipe],
  template: `
    @let polls = (polls$ | async)?.data;
    @for (poll of polls; track poll.id) {
      <app-poll-card [poll]="poll" />
    }
  `,
})
export class UserProfilePollsPage {
  private readonly userId$ = inject(ActivatedRoute).parent?.paramMap.pipe(
    map((p) => p.get('id')),
  );

  private pollQueries = inject(PollQueries);

  protected polls$ = this.userId$?.pipe(
    filter((userId) => userId != null),
    switchMap((userId) => this.pollQueries.getPollsByUser$(userId)),
  );
}
