import { inject, Injectable } from '@angular/core';
import { injectMutation, injectQuery, injectQueryClient } from '@ngneat/query';
import { PollApi } from './poll-api';
import { Poll } from '@/models/poll';
import { Observable } from 'rxjs';

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

  static getPollsByUserQueryKey(userId?: string) {
    return ['polls', { userId }];
  }

  static getPollQueryKey(pollId: string) {
    return ['polls', pollId];
  }

  static getLikedPollsQueryKey(userId?: string) {
    return [
      'polls',
      {
        userId,
        liked: true,
      },
    ];
  }

  static getBookmarkedPollsQueryKey(userId?: string) {
    return [
      'polls',
      {
        userId,
        bookmarked: true,
      },
    ];
  }

  getPolls$() {
    return this.query({
      queryKey: PollQueries.getPollsQueryKey(),
      queryFn: () => this.pollApi.getPollList$(),
    }).result$;
  }

  getPollsByUser$(userId?: string) {
    return this.query({
      queryKey: PollQueries.getPollsByUserQueryKey(userId),
      queryFn: () => this.pollApi.getPollsByUser$(userId!),
      enabled: !!userId,
    }).result$;
  }

  getLikedPolls$(userId?: string) {
    return this.query({
      queryKey: PollQueries.getLikedPollsQueryKey(userId),
      queryFn: () => this.pollApi.getLikedPolls$(userId!),
      enabled: !!userId,
    }).result$;
  }

  getBookmarkedPolls$(userId?: string) {
    return this.query({
      queryKey: PollQueries.getBookmarkedPollsQueryKey(userId),
      queryFn: () => this.pollApi.getBookmarkedPolls$(userId!),
      enabled: !!userId,
    }).result$;
  }

  getPoll$(pollId: string) {
    return this.query({
      queryKey: PollQueries.getPollQueryKey(pollId),
      queryFn: () => this.pollApi.getPoll$(pollId),
    }).result$;
  }

  createPoll() {
    return this.mutation({
      mutationFn: (pollDto: {
        question: string;
        description?: string | null;
        options: string[];
      }) => this.pollApi.createPoll$(pollDto),
      onSuccess: () => {
        console.log('success');
      },
    });
  }

  likePoll(pollId: string) {
    return this.mutation({
      mutationFn: (liked: boolean) => this.pollApi.likePoll$(pollId, liked),
      onSuccess: () => {
        this.queryClient.invalidateQueries({
          queryKey: ['polls'],
        });
      },
    });
  }

  bookmarkPoll(pollId: string) {
    return this.mutation({
      mutationFn: (bookmarked: boolean) =>
        this.pollApi.bookmarkPoll$(pollId, bookmarked),
      onSuccess: () => {
        this.queryClient.invalidateQueries({
          queryKey: ['polls'],
        });
      },
    });
  }
}
