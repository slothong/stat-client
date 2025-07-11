import { Poll } from '@/models/poll';
import { PollDto } from '@/models/poll-dto';
import { PollResultDto } from '@/models/poll-result-dto';
import { User } from '@/models/user';
import { HttpClient } from '@angular/common/http';
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
    return this.http.post('/api/polls', pollDto);
  }

  getPollList$() {
    return this.http
      .get<PollDto[]>('/api/polls')
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

  getPollResult$(pollId: string) {
    return this.http.get<PollResultDto>(`/api/polls/${pollId}/result`);
  }

  likePoll$(pollId: string, liked: boolean) {
    if (liked)
      return this.http.post<PollDto>(`/api/polls/${pollId}/like`, { liked });
    return this.http.delete<PollDto>(`/api/polls/${pollId}/like`);
  }

  private fromDto(dto: PollDto): Poll {
    return {
      id: dto.id,
      question: dto.question,
      description: dto.description,
      createdAt: new Date(dto.createdAt),
      options: dto.options.map((optionDto) => ({
        id: optionDto.id,
        optionText: optionDto.optionText,
        voteCount: optionDto.voteCount,
        votedByMe: optionDto.votedByMe,
      })),
      hasVoted: dto.hasVoted,
      createdBy: User.fromDto(dto.createdBy),
      likedByMe: dto.likedByMe,
    };
  }
}
