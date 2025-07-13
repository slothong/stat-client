import { PollCard } from '@/components/poll-card';
import { MeStore } from '@/services/me-store';
import { PollQueries } from '@/services/poll-queries';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { switchMap } from 'rxjs';

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
  protected readonly me$ = inject(MeStore).user$;

  private pollQueries = inject(PollQueries);

  protected polls$ = this.me$.pipe(
    switchMap((me) => this.pollQueries.getPollsByUser$(me?.id)),
  );
}
