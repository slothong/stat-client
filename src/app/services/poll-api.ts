import { BASE_API_URL } from '@/constants';
import { Poll } from '@/models/poll';
import { PollDto } from '@/models/poll-dto';
import { PollListDto } from '@/models/poll-list-dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PollApi {
  private readonly http = inject(HttpClient);

  createPoll$(pollDto: {
    question: string;
    description?: string | null;
    options: string[];
  }) {
    return this.http.post<Poll>('/api/polls', pollDto);
  }

  getPollList$({ after, sort }: { after?: string; sort?: string }) {
    console.log(after);
    let params = new HttpParams().set('limit', after ? '5' : '10');
    if (after) {
      console.log('Set after');
      params = params.set('after', after);
    }

    if (sort) {
      params = params.set('sort', sort);
    }
    console.log(params);

    return this.http.get<PollListDto>('/api/polls', { params }).pipe(
      map((pollListDto) => ({
        data: pollListDto.data.map((dto) => this.fromDto(dto)),
        nextCursor: pollListDto.nextCursor,
      })),
    );
  }

  getPollsByUser$(userId: string) {
    return this.http
      .get<PollDto[]>(`/api/users/${userId}/polls`)
      .pipe(
        map((pollDtos) => pollDtos.map((pollDto) => this.fromDto(pollDto))),
      );
  }

  getLikedPolls$(userId: string) {
    return this.http
      .get<PollDto[]>(`/api/users/${userId}/liked-polls`)
      .pipe(
        map((pollDtos) => pollDtos.map((pollDto) => this.fromDto(pollDto))),
      );
  }

  getBookmarkedPolls$(userId: string) {
    return this.http
      .get<PollDto[]>(`/api/users/${userId}/bookmarked-polls`)
      .pipe(
        map((pollDtos) => pollDtos.map((pollDto) => this.fromDto(pollDto))),
      );
  }

  getPoll$(pollId: string) {
    return this.http
      .get<PollDto>(`/api/polls/${pollId}`)
      .pipe(map((pollDto) => this.fromDto(pollDto)));
  }

  votePoll$(pollId: string, optionId: string) {
    return this.http
      .post<PollDto>(`/api/polls/${pollId}/votes`, {
        optionIds: [optionId],
      })
      .pipe(map((pollDto) => this.fromDto(pollDto)));
  }

  likePoll$(pollId: string, liked: boolean) {
    if (liked)
      return this.http.post<PollDto>(`/api/polls/${pollId}/like`, { liked });
    return this.http.delete<PollDto>(`/api/polls/${pollId}/like`);
  }

  bookmarkPoll$(pollId: string, bookmarked: boolean) {
    if (bookmarked)
      return this.http.post<PollDto>(`/api/polls/${pollId}/bookmark`, {});
    return this.http.delete<PollDto>(`/api/polls/${pollId}/bookmark`);
  }

  private fromDto(dto: PollDto): Poll {
    return {
      id: dto.id,
      question: dto.question,
      description: dto.description,
      expiresAt: dto.expiresAt,
      createdAt: new Date(dto.createdAt),
      options: dto.options.map((optionDto) => ({
        id: optionDto.id,
        optionText: optionDto.optionText,
        voteCount: optionDto.voteCount,
        votedByMe: optionDto.votedByMe,
      })),
      hasVoted: dto.hasVoted,
      createdBy: {
        id: dto.createdBy.userId,
        username: dto.createdBy.username,
        avatarUrl:
          dto.createdBy.avatarUrl && BASE_API_URL + dto.createdBy.avatarUrl,
      },
      likedByMe: dto.likedByMe,
      commentCount: dto.commentCount,
      bookmarkedByMe: dto.bookmarkedByMe,
    };
  }
}
