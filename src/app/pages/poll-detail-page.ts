import { PollDetail } from '@/components/poll-detail';
import { PollStore } from '@/services/poll-store';
import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs';
import { PollResultView } from '@/components/poll-result-view';

@Component({
  selector: 'app-poll-detail-page',
  imports: [PollDetail, AsyncPipe, PollResultView],
  template: `
    @let poll = (poll$ | async) ?? undefined; @if (poll?.hasVoted) {
    <app-poll-result-view [pollId]="poll?.id" />
    } @else {
    <app-poll-detail [poll]="poll" />
    }
  `,
})
export class PollDetailPage implements OnInit {
  protected readonly pollId$ = inject(ActivatedRoute).paramMap.pipe(
    map((p) => p.get('id'))
  );

  private readonly pollStore = inject(PollStore);

  private readonly router = inject(Router);

  protected readonly poll$ = this.pollId$.pipe(
    filter((pollId) => pollId != null),
    switchMap((pollId) => this.pollStore.getPoll$(pollId))
  );

  ngOnInit() {
    this.poll$.subscribe((poll) => {
      if (poll?.hasVoted) {
        this.router.navigate(['polls', poll.id, 'result']);
      }
    });
  }
}
