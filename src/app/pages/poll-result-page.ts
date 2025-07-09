import { PollResultView } from '@/components/poll-result-view';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-poll-result-page',
  imports: [PollResultView, AsyncPipe],
  template: `<app-poll-result-view [pollId]="pollId$ | async" />`,
})
export class PollResultPage {
  protected readonly pollId$ = inject(ActivatedRoute).paramMap.pipe(
    map((p) => p.get('id'))
  );
}
