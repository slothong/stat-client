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
    return ['polls', pollId, 'comments'];
  }

  getComments$(pollId: string) {
    return this.query({
      queryKey: CommentQueries.getCommentsQueryKey(pollId),
      queryFn: () => this.api.getComments$(pollId),
    });
  }

  postComment(pollId: string) {
    return this.mutation({
      mutationFn: (content: string) => this.api.postComment$(pollId, content),
      onSuccess: () => {
        this.queryClient.invalidateQueries({
          queryKey: CommentQueries.getCommentsQueryKey(pollId),
        });
      },
    });
  }
}
