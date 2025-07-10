import { inject, Injectable } from '@angular/core';
import { injectMutation, injectQuery } from '@ngneat/query';
import { PollApi } from './poll-api';
import { Poll } from '@/models/poll';

@Injectable({
  providedIn: 'root',
})
export class PollQueries {
  private readonly query = injectQuery();
  private readonly mutation = injectMutation();
  private readonly pollApi = inject(PollApi);

  getPolls() {
    return this.query({
      queryKey: ['polls'],
      queryFn: () => this.pollApi.getPollList(),
    });
  }

  getPoll(pollId?: string) {
    return this.query({
      queryKey: ['polls', pollId],
      queryFn: () => this.pollApi.getPoll(pollId!),
      enabled: pollId != null,
    });
  }

  // createPoll() {
  //   return this.mutation({
  //     mutationFn: ()
  //   })
  // }
}
