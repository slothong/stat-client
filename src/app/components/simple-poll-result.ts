import { Component, input } from '@angular/core';
import { PostMeta } from './post-meta';
import { Poll } from '@/models/poll';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { PollResultChart } from './poll-result-chart';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-simple-poll-result',
  imports: [PostMeta, AsyncPipe, PollResultChart, RouterLink],
  host: {
    class: 'flex py-3 px-8 flex-col h-full',
  },
  template: `
    @let poll = poll$ | async;
    @if (poll) {
      <app-post-meta
        [createdAt]="poll.createdAt"
        [avatarUrl]="poll.createdBy.avatarUrl"
      >
        {{ poll.createdBy.username }}
      </app-post-meta>

      <a
        class="no-underline text-inherit grow flex flex-col"
        [routerLink]="['polls', poll.id]"
      >
        <div class="mt-3 mb-2 font-bold text-gray-500">
          {{ poll.question }}
        </div>
        <div class="grow">
          <app-poll-result-chart [pollResult]="poll" />
        </div>
        <div class="flex gap-1 text-xs text-gray-400">
          <span>{{ poll.likedByCount }} Likes </span>
          •
          <span> {{ poll.commentCount }} Comments </span>
        </div>
      </a>
    }
  `,
})
export class SimplePollResult {
  readonly poll = input<Poll>();
  protected readonly poll$ = toObservable(this.poll);
}
