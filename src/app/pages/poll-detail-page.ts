import { VoteForm } from '@/components/vote-form';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { PollResultView } from '@/components/poll-result-view';
import { PollQueries } from '@/services/poll-queries';

@Component({
  selector: 'app-poll-detail-page',
  imports: [VoteForm, AsyncPipe, PollResultView],
  template: `
    @let poll = (poll$ | async)?.data;
    @if (poll && poll?.hasVoted) {
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
  );
}
