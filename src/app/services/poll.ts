import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Poll {
  private readonly http = inject(HttpClient);

  createPoll(pollDto: {
    question: string;
    description?: string | null;
    options: string[];
  }) {
    console.log('createpoll');
    return this.http.post('/api/polls', pollDto);
  }
}
