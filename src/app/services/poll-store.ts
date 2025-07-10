import { Poll } from '@/models/poll';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PollApi } from './poll-api';

@Injectable({
  providedIn: 'root',
})
export class PollStore {
  private readonly pollMap = new Map<string, BehaviorSubject<Poll | null>>();

  private readonly pollApi = inject(PollApi);

  getPoll$(pollId: string): Observable<Poll | null> {
    const poll = this.pollMap.get(pollId);
    if (!poll) {
      const subject = new BehaviorSubject<Poll | null>(null);
      this.pollMap.set(pollId, subject);
      this.fetch(pollId);
      return subject;
    }
    return poll.asObservable();
  }

  fetch(pollId: string) {
    this.pollApi.getPoll$(pollId).subscribe((poll) => {
      this.pollMap.get(pollId)?.next(poll);
    });
  }

  reload(pollId: string) {
    this.fetch(pollId);
  }
}
