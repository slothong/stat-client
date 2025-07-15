import { CommentQueries } from '@/services/comment-queries';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-profile-comments-page',
  template: ` 댓글 `,
})
export class UserProfileCommentsPage {
  private readonly userId$ = inject(ActivatedRoute)?.paramMap.pipe(
    map((p) => p.get('id')),
  );

  protected readonly commentQueries = inject(CommentQueries);
}
