import { inject, Injectable } from '@angular/core';
import {
  injectInfiniteQuery,
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@ngneat/query';
import { PollApi } from './poll-api';
import { Poll } from '@/models/poll';

@Injectable({
  providedIn: 'root',
})
export class PollQueries {
  private readonly queryClient = injectQueryClient();
  private readonly query = injectQuery();
  private readonly inifiniteQuery = injectInfiniteQuery();
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

  static getHotPollsQueryKey() {
    return [
      'polls',
      {
        sort: 'hot',
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
    return this.inifiniteQuery<
      { data: Poll[]; nextCursor?: string },
      unknown,
      { pages: { data: Poll[]; nextCursor?: string }[] },
      string[],
      string | undefined
    >({
      queryKey: PollQueries.getPollsQueryKey(),
      queryFn: ({ pageParam }) =>
        this.pollApi.getPollList$({
          after: pageParam,
          limit: pageParam ? 10 : 5,
        }),
      initialPageParam: undefined,
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    }).result$;
  }

  getHotPolls$() {
    return this.query({
      queryKey: PollQueries.getHotPollsQueryKey(),
      queryFn: () => this.pollApi.getPollList$({ sort: 'hot', limit: 10 }),
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
        duration: string;
        options: string[];
      }) => this.pollApi.createPoll$(pollDto),
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
