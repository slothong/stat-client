import { inject, Injectable } from '@angular/core';
import { injectMutation, injectQuery } from '@ngneat/query';
import { PollApi } from './poll-api';
import { PollDto } from '@/models/poll-dto';

@Injectable({
  providedIn: 'root',
})
export class PollQueries {
  private readonly query = injectQuery();
  private readonly mutation = injectMutation();
  private readonly pollApi = inject(PollApi);

  static getPollsQueryKey() {
    return ['polls'];
  }

  static getPollQueryKey(pollId: string) {
    return ['polls', pollId];
  }

  static getPollResultQueryKey(pollId: string) {
    return ['polls', pollId, 'result'];
  }

  getPolls$() {
    return this.query({
      queryKey: PollQueries.getPollsQueryKey(),
      queryFn: () => this.pollApi.getPollList$(),
    }).result$;
  }

  getPoll$(pollId: string) {
    return this.query({
      queryKey: PollQueries.getPollQueryKey(pollId),
      queryFn: () => this.pollApi.getPoll$(pollId),
    }).result$;
  }

  getPollResult$(pollId: string) {
    return this.query({
      queryKey: PollQueries.getPollResultQueryKey(pollId),
      queryFn: () => this.pollApi.getPollResult$(pollId),
    }).result$;
  }

  createPoll() {
    return this.mutation({
      mutationFn: (pollDto: {
        question: string;
        description?: string | null;
        options: string[];
      }) => this.pollApi.createPoll$(pollDto),
    });
  }
}
