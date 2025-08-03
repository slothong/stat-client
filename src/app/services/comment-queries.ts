import { inject, Injectable } from '@angular/core';
import { CommentApi } from './comment-api';
import { injectMutation, injectQuery, injectQueryClient } from '@ngneat/query';

@Injectable({
  providedIn: 'root',
})
export class CommentQueries {
  private readonly api = inject(CommentApi);
  private readonly query = injectQuery();
  private readonly mutation = injectMutation();
  private readonly queryClient = injectQueryClient();

  static getCommentsQueryKey(pollId: string) {
    return [
      'comments',
      {
        pollId,
      },
    ];
  }

  static getCommentsByUserQueryKey(userId: string) {
    return [
      'comments',
      {
        userId,
      },
    ];
  }

  getComments(pollId: string) {
    return this.query({
      queryKey: CommentQueries.getCommentsQueryKey(pollId),
      queryFn: () => this.api.getComments$(pollId),
    });
  }

  getCommentsByUser(userId: string) {
    return this.query({
      queryKey: CommentQueries.getCommentsByUserQueryKey(userId),
      queryFn: () => this.api.getCommentsByUser$(userId),
    });
  }

  postComment(pollId: string) {
    return this.mutation({
      mutationFn: ({
        parentId,
        content,
      }: {
        parentId?: string;
        content: string;
      }) =>
        this.api.postComment$({
          pollId,
          parentId,
          content,
        }),
      onSuccess: () => {
        this.queryClient.invalidateQueries({
          queryKey: CommentQueries.getCommentsQueryKey(pollId),
        });
      },
    });
  }

  likeComment(commentId: string) {
    return this.mutation({
      mutationFn: (liked: boolean) => this.api.likeComment$(commentId, liked),
      onSuccess: () => {
        this.queryClient.invalidateQueries({
          queryKey: ['comments'],
        });
      },
    });
  }
}
