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
import { SimplePollListItem } from './simple-poll-list-item';
import { Carousel } from './ui/carousel';
import { CarouselItem } from './ui/carousel-item';

@Component({
  selector: 'app-poll-feed',
  imports: [CommonModule, PollCard, SimplePollListItem, Carousel, CarouselItem],
  host: {
    class: 'flex gap-20',
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
    <div class="w-80 h-fit flex flex-col">
      <app-carousel class="w-full h-60 bg-gray-100">
        @if (hotPollList$ | async; as hotPollList) {
          @if (hotPollList.isSuccess) {
            @for (poll of hotPollList.data.data; track poll.id) {
              <app-simple-poll-list-item [poll]="poll" *appCarouselItem />
            }
          }
        }
      </app-carousel>
      <div class="card bg-base-100 shadow-sm overflow-hidden">
        <div class="card-body">
          <span>가장 핫한 투표</span>
          @if (hotPollList$ | async; as hotPollList) {
            @if (hotPollList.isSuccess) {
              @for (poll of hotPollList.data.data; track poll.id) {
                <app-simple-poll-list-item [poll]="poll" />
              }
            }
          }
        </div>
      </div>
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
