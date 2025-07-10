import { inject, Injectable } from '@angular/core';
import { injectMutation, injectQuery } from '@ngneat/query';
import { PollApi } from './poll-api';

@Injectable({
  providedIn: 'root',
})
export class PollQueries {
  private readonly query = injectQuery();
  private readonly mutation = injectMutation();
  private readonly pollApi = inject(PollApi);

  getPolls$() {
    return this.query({
      queryKey: ['polls'],
      queryFn: () => this.pollApi.getPollList$(),
    }).result$;
  }

  getPoll$(pollId?: string) {
    return this.query({
      queryKey: ['polls', pollId],
      queryFn: () => this.pollApi.getPoll$(pollId!),
      enabled: pollId != null,
    });
  }

  getPollResult$(pollId?: string) {
    return this.query({
      queryKey: ['polls', pollId, 'result'],
      queryFn: () => this.pollApi.getPollResult$(pollId!),
      enabled: pollId != null,
    });
  }

  // createPoll() {
  //   return this.mutation({
  //     mutationFn: ()
  //   })
  // }
}
