import { Poll } from '@/models/poll';
import { Component, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { PostMeta } from './post-meta';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-simple-poll-list-item',
  imports: [AsyncPipe, PostMeta, RouterLink],
  host: {
    class: 'py-1',
  },
  template: `
    @let poll = poll$ | async;
    @if (poll) {
      <app-post-meta
        [avatarUrl]="poll.createdBy.avatarUrl"
        [createdAt]="poll.createdAt"
        >{{ poll.createdBy.username }}</app-post-meta
      >
      <div class="mt-3 mb-2 font-bold text-gray-500">
        <a class="no-underline text-inherit" [routerLink]="['polls', poll.id]">
          {{ poll.question }}
        </a>
      </div>
      <div class="flex gap-1 text-xs text-gray-400">
        <span> Likes </span>
        •
        <span> {{ poll.commentCount }} Comments </span>
      </div>
    }
  `,
})
export class SimplePollListItem {
  readonly poll = input<Poll>();
  protected readonly poll$ = toObservable(this.poll);
}
