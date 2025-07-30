import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  ElementRef,
  effect,
  viewChildren,
} from '@angular/core';
import { PollQueries } from '@/services/poll-queries';
import { PollCard } from './poll-card';
import { Subject, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-poll-feed',
  imports: [CommonModule, PollCard],
  host: {
    class: 'flex gap-3',
  },
  template: `
    <div class="flex flex-col gap-3 grow">
      @if (pollList$ | async; as result) {
        @if (result.isLoading) {
          <p>Loading</p>
        }
        @if (result.isError) {
          <p>Error</p>
        }
        @if (result.isSuccess) {
          @for (page of result.data.pages; track $index) {
            @for (poll of page.data; track poll.id) {
              <app-poll-card [poll]="poll" />
              @if (!$last) {
                <div class="w-full h-[1px] border-none bg-gray-200"></div>
              }
            }
          }
        }
      }
    </div>
    <div class="w-36 bg-gray-200 h-60 rounded-2xl px-2 py-2">
      @if (hotPollList$ | async; as hotPollList) {
        <div>
          @if (hotPollList.isSuccess) {
            @for (page of hotPollList.data.pages; track $index) {
              @for (poll of page.data; track poll.id) {
                <div>
                  {{ poll.question }}
                </div>
              }
            }
          }
        </div>
      }
    </div>
  `,
})
export class PollFeed {
  protected readonly pollList$ = inject(PollQueries).getPolls$();
  protected readonly hotPollList$ = inject(PollQueries).getHotPolls$();

  private readonly pollCards = viewChildren(PollCard, {
    read: ElementRef,
  });
  private readonly nearBottom$ = new Subject<void>();

  private readonly observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        this.nearBottom$.next();
      }
    },
    {
      root: null,
      threshold: 0.1,
    },
  );

  private prevTarget: HTMLElement | null = null;

  constructor() {
    this.nearBottom$
      .pipe(withLatestFrom(this.pollList$))
      .subscribe(([_, pollList]) => {
        console.log(pollList.hasNextPage);
        if (pollList.hasNextPage) {
          pollList.fetchNextPage();
        }
      });

    effect(() => {
      const pollCards = this.pollCards();
      if (pollCards && pollCards.length > 0) {
        const last = pollCards[pollCards.length - 1];
        if (this.prevTarget) {
          this.observer.unobserve(this.prevTarget);
        }

        this.observer.observe(last.nativeElement);
        this.prevTarget = last.nativeElement;
      }
    });
  }
}
