import { VoteForm } from '@/components/vote-form';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { PollResultView } from '@/components/poll-result-view';
import { PollQueries } from '@/services/poll-queries';
import { isBefore } from 'date-fns';

@Component({
  selector: 'app-poll-detail-page',
  imports: [VoteForm, AsyncPipe, PollResultView],
  template: `
    @let poll = poll$ | async;
    @let hasVoted = poll?.hasVoted;
    @let isExpired = isExpired$ | async;
    @if (poll && (hasVoted || isExpired)) {
      <app-poll-result-view [poll]="poll" />
    } @else {
      <app-vote-form [pollId]="pollId$ | async" />
    }
  `,
})
export class PollDetailPage {
  protected readonly pollId$ = inject(ActivatedRoute).paramMap.pipe(
    map((p) => p.get('id')),
  );

  private readonly pollQueries = inject(PollQueries);

  protected poll$ = this.pollId$.pipe(
    filter((pollId): pollId is string => !!pollId),
    switchMap((pollId) => this.pollQueries.getPoll$(pollId)),
    map((poll) => poll.data),
  );

  protected readonly isExpired$ = this.poll$.pipe(
    map((poll) => poll?.expiresAt && isBefore(poll?.expiresAt, new Date())),
  );
}
