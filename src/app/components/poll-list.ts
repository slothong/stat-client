import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PollQueries } from '@/services/poll-queries';
import { PollCard } from './poll-card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-list',
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
        @for (poll of result.data; track poll) {
          <app-poll-card [poll]="poll" (click)="goToPoll(poll.id)" />
          @if (!$last) {
            <div class="w-full h-[1px] border-none bg-gray-200"></div>
          }
        }
      }
    }
  `,
})
export class PollList {
  protected readonly pollList$ = inject(PollQueries).getPolls$();
  private readonly router = inject(Router);

  goToPoll(pollId: string) {
    this.router.navigate(['/polls', pollId]);
  }
}
