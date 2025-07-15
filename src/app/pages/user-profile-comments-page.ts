import { CommentCard } from '@/components/comment-card';
import { CommentQueries } from '@/services/comment-queries';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-profile-comments-page',
  imports: [CommentCard, AsyncPipe],
  template: `
    @let comments = (comments$ | async)?.data;

    @for (comment of comments; track comment.id) {
      <app-comment-card [comment]="comment" />
    }
  `,
})
export class UserProfileCommentsPage {
  private readonly userId$ = inject(ActivatedRoute)?.paramMap.pipe(
    map((p) => p.get('id')),
  );

  protected readonly commentQueries = inject(CommentQueries);

  protected readonly comments$ = this.userId$.pipe(
    filter((userId) => userId != null),
    switchMap(
      (userId) => this.commentQueries.getCommentsByUser(userId).result$,
    ),
  );
}
