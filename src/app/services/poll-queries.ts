import { inject, Injectable } from '@angular/core';
import { injectMutation, injectQuery, injectQueryClient } from '@ngneat/query';
import { PollApi } from './poll-api';

@Injectable({
  providedIn: 'root',
})
export class PollQueries {
  private readonly queryClient = injectQueryClient();
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

  likePoll(pollId: string) {
    return this.mutation({
      mutationFn: (liked: boolean) => this.pollApi.likePoll$(pollId, liked),
      onSuccess: () => {
        this.queryClient.invalidateQueries({
          queryKey: PollQueries.getPollQueryKey(pollId),
        });
      },
    });
  }
}
