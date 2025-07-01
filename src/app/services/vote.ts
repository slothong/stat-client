import { inject, Injectable } from '@angular/core';
import { PollStore } from './poll-store';
import { PollApi } from './poll-api';

@Injectable({
  providedIn: 'root',
})
export class Vote {
  private readonly pollApi = inject(PollApi);
  private readonly pollStore = inject(PollStore);

  vote(pollId: string, optionId: string) {
    this.pollApi.votePoll(pollId, optionId).subscribe({
      next: () => {
        this.pollStore.reload(pollId);
      },
    });
  }
}
