import { Poll } from '@/models/poll';
import { PollDto } from '@/models/poll-dto';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PollApi {
  private readonly http = inject(HttpClient);

  createPoll(pollDto: {
    question: string;
    description?: string | null;
    options: string[];
  }) {
    return this.http.post('/api/polls', pollDto);
  }

  getPollList() {
    return this.http
      .get<PollDto[]>('/api/polls')
      .pipe(
        map((pollDtos) => pollDtos.map((pollDto) => Poll.fromDto(pollDto)))
      );
  }
}
