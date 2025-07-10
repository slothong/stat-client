import { CommentDto } from '@/models/comment-dto';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentApi {
  private readonly http = inject(HttpClient);

  getComments$(pollId: string) {
    return this.http.get<CommentDto[]>(`/api/polls/${pollId}/comments`);
  }

  postComment$(pollId: string, content: string) {
    return this.http.post<CommentDto>(`/api/polls/${pollId}/comments`, {
      content,
    });
  }
}
