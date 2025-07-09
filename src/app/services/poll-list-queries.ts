import { Poll } from '@/models/poll';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { injectQuery } from '@ngneat/query';
import { map } from 'rxjs';
import { PollApi } from './poll-api';

@Injectable({
  providedIn: 'root',
})
export class PollListQueries {
  private readonly query = injectQuery();
  private readonly pollApi = inject(PollApi);

  getPolls() {
    return this.query({
      queryKey: ['polls'],
      queryFn: () => this.pollApi.getPollList(),
    });
  }
}
