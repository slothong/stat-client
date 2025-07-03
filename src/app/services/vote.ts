import { inject, Injectable } from '@angular/core';
import { PollStore } from './poll-store';
import { PollApi } from './poll-api';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Vote {
  private readonly pollApi = inject(PollApi);
  private readonly pollStore = inject(PollStore);

  vote(pollId: string, optionId: string) {
    return this.pollApi.votePoll(pollId, optionId).pipe(
      tap(() => {
        this.pollStore.reload(pollId);
      })
    );
  }
}
