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
    class: 'flex flex-col gap-3',
  },
  template: `
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
  `,
})
export class PollFeed {
  protected readonly pollList$ = inject(PollQueries).getPolls$();
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
        pollList.fetchNextPage();
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
