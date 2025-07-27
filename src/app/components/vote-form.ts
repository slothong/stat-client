import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Vote } from '@/services/vote';
import { PollQueries } from '@/services/poll-queries';
import {
  combineLatest,
  filter,
  map,
  ReplaySubject,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PostMeta } from './post-meta';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-vote-form',
  imports: [ReactiveFormsModule, AsyncPipe, NgIcon, PostMeta],
  template: `
    @let formGroup = formGroup$ | async;
    @let poll = (pollQuery$ | async)?.data;
    @if (formGroup && poll) {
      <form (ngSubmit)="submitForm()" [formGroup]="formGroup">
        <app-post-meta [createdAt]="poll?.createdAt">
          {{ poll?.createdBy?.username }}
        </app-post-meta>

        <div class="flex flex-col pb-3">
          <strong class="pt-3">
            {{ poll?.question }}
          </strong>
          @if (poll?.description) {
            <p>
              {{ poll?.description }}
            </p>
          }

          <div class="mb-3">
            @for (option of poll?.options; track option) {
              <label
                class="hover:bg-gray-100 py-1 px-1 flex items-center gap-2"
              >
                <input
                  type="radio"
                  class="radio radio-xs m-0"
                  formControlName="optionId"
                  [value]="option.id"
                />
                {{ option.optionText }}
              </label>
            }
          </div>

          <button
            type="submit"
            class="btn btn-block btn-primary"
            [disabled]="!!poll.hasVoted"
          >
            투표하기
          </button>

          <div class="flex gap-2 mt-6">
            <button
              type="button"
              class="btn btn-circle btn-sm"
              (click)="$event.stopPropagation(); likePoll(!poll?.likedByMe)"
            >
              <ng-icon
                [name]="poll?.likedByMe ? 'heroHeartSolid' : 'heroHeart'"
                size="15"
              />
            </button>
            <button
              type="button"
              class="btn btn-circle btn-sm"
              (click)="
                $event.stopPropagation(); bookmark(!poll?.bookmarkedByMe)
              "
            >
              <ng-icon
                [name]="
                  poll?.bookmarkedByMe ? 'heroBookmarkSolid' : 'heroBookmark'
                "
                size="15"
              />
            </button>
            <button type="button" class="btn btn-sm font-normal">
              <ng-icon name="heroChatBubbleOvalLeft" size="15" />
              {{ poll?.commentCount }}
            </button>
          </div>
        </div>
      </form>
    }
  `,
})
export class VoteForm {
  @Input()
  set pollId(value: string | null) {
    if (value) {
      this.pollId$.next(value);
    }
  }

  private readonly pollId$ = new ReplaySubject<string>(1);

  private readonly pollQueries = inject(PollQueries);

  readonly pollQuery$ = this.pollId$.pipe(
    switchMap((pollId) => this.pollQueries.getPoll$(pollId)),
    shareReplay(1),
  );

  private readonly vote = inject(Vote);

  protected formGroup$ = this.pollQuery$.pipe(
    map((pollResult) => {
      const poll = pollResult.data;
      return new FormGroup({
        optionId: new FormControl<string | null>(poll?.options[0]?.id ?? null),
      });
    }),
    shareReplay(1),
  );

  protected submitForm() {
    combineLatest([this.formGroup$, this.pollQuery$])
      .pipe(
        take(1),
        map(([formGroup, pollResult]) => ({
          optionId: formGroup.controls.optionId.value,
          pollId: pollResult.data?.id,
        })),
        filter(
          (result): result is { optionId: string; pollId: string } =>
            !!result.optionId && !!result.pollId,
        ),
        switchMap(({ optionId, pollId }) => this.vote.vote$(pollId, optionId)),
      )
      .subscribe();
  }

  protected likePoll(liked: boolean) {
    this.pollQuery$.pipe(take(1)).subscribe((poll) => {
      if (poll.data?.id) {
        this.pollQueries.likePoll(poll.data.id).mutate(liked);
      }
    });
  }

  protected bookmark(bookmarked: boolean) {
    this.pollQuery$.pipe(take(1)).subscribe((poll) => {
      if (poll.data?.id) {
        this.pollQueries.bookmarkPoll(poll.data.id).mutate(bookmarked);
      }
    });
  }
}
