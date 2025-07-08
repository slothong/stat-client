import { PollDetail } from '@/components/poll-detail/poll-detail';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-poll-detail-page',
  imports: [PollDetail, AsyncPipe],
  template: ` <app-poll-detail [pollId]="pollId | async" /> `,
})
export class PollDetailPage {
  protected readonly pollId = inject(ActivatedRoute).paramMap.pipe(
    map((p) => p.get('id'))
  );
}
