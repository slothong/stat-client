import { BASE_API_URL } from '@/constants';
import { Comment } from '@/models/comment';
import { CommentDto } from '@/models/comment-dto';
import { PollDto } from '@/models/poll-dto';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentApi {
  private readonly http = inject(HttpClient);

  getComments$(pollId: string) {
    return this.http
      .get<CommentDto[]>(`/api/polls/${pollId}/comments`)
      .pipe(map((dtos) => dtos.map((dto) => this.fromDto(dto))));
  }

  getCommentsByUser$(userId: string) {
    return this.http
      .get<CommentDto[]>(`/api/users/${userId}/comments`)
      .pipe(map((dtos) => dtos.map((dto) => this.fromDto(dto))));
  }

  likeComment$(commentId: string, liked: boolean) {
    if (liked)
      return this.http.post<CommentDto>(`/api/comments/${commentId}/like`, {
        liked,
      });
    return this.http.delete<null>(`/api/comments/${commentId}/like`);
  }

  postComment$({
    pollId,
    parentId,
    content,
  }: {
    pollId: string;
    parentId?: string;
    content: string;
  }) {
    return this.http
      .post<CommentDto>(`/api/polls/${pollId}/comments`, {
        content,
        parentId,
      })
      .pipe(map((dto) => this.fromDto(dto)));
  }

  private fromDto(dto: CommentDto): Comment {
    return {
      ...dto,
      author: {
        ...dto.author,
        avatarUrl: dto.author.avatarUrl && BASE_API_URL + dto.author.avatarUrl,
      },
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      replies: dto.replies.map((replyDto) => this.fromDto(replyDto)),
      likedByMe: dto.likedByMe,
      likedByCount: dto.likedByCount ?? 0,
    };
  }
}
