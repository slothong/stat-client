import { inject, Injectable } from '@angular/core';
import { PollApi } from './poll-api';
import { tap } from 'rxjs';
import { injectQueryClient } from '@ngneat/query';

@Injectable({
  providedIn: 'root',
})
export class Vote {
  private readonly pollApi = inject(PollApi);
  private readonly queryClient = injectQueryClient();

  vote$(pollId: string, optionId: string) {
    return this.pollApi.votePoll$(pollId, optionId).pipe(
      tap(() => {
        this.queryClient.invalidateQueries({
          queryKey: ['polls', pollId],
        });
      }),
    );
  }
}
