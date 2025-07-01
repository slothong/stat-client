import { PollDetail } from '@/components/poll-detail/poll-detail';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-poll-detail-page',
  templateUrl: './poll-detail-page.html',
  imports: [PollDetail, AsyncPipe],
})
export class PollDetailPage {
  protected readonly pollId = inject(ActivatedRoute).paramMap.pipe(
    map((p) => p.get('id'))
  );
}
