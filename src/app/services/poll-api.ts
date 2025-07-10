import { Poll } from '@/models/poll';
import { PollDto } from '@/models/poll-dto';
import { PollResultDto } from '@/models/poll-result-dto';
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
        map((pollDtos) => pollDtos.map((pollDto) => Poll.fromDto(pollDto))),
      );
  }

  getPoll$(pollId: string) {
    return this.http
      .get<PollDto>(`/api/polls/${pollId}`)
      .pipe(map((pollDto) => Poll.fromDto(pollDto)));
  }

  votePoll$(pollId: string, optionId: string) {
    return this.http
      .post<PollDto>(`/api/polls/${pollId}/votes`, {
        optionIds: [optionId],
      })
      .pipe(map((pollDto) => Poll.fromDto(pollDto)));
  }

  getPollResult$(pollId: string) {
    return this.http.get<PollResultDto>(`/api/polls/${pollId}/result`);
  }
}
