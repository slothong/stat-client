import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Vote } from '@/services/vote';
import { PollQueries } from '@/services/poll-queries';
import {
  combineLatest,
  filter,
  map,
  ReplaySubject,
  shareReplay,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PostMeta } from './post-meta';
import { NgIcon } from '@ng-icons/core';
import { isBefore } from 'date-fns';

@Component({
  selector: 'app-vote-form',
  imports: [ReactiveFormsModule, AsyncPipe, NgIcon, PostMeta],
  template: `
    @let poll = poll$ | async;
    @if (formGroup && poll) {
      <form (ngSubmit)="submitForm()" [formGroup]="formGroup">
        <app-post-meta
          [createdAt]="poll?.createdAt"
          [avatarUrl]="poll?.createdBy?.avatarUrl"
        >
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
            [disabled]="isDisabled$ | async"
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
export class VoteForm implements OnInit, OnDestroy {
  @Input()
  set pollId(value: string | null) {
    if (value) {
      this.pollId$.next(value);
    }
  }

  private readonly pollId$ = new ReplaySubject<string>(1);

  private readonly pollQueries = inject(PollQueries);

  private readonly pollQuery$ = this.pollId$.pipe(
    switchMap((pollId) => this.pollQueries.getPoll$(pollId)),
    shareReplay(1),
  );

  protected readonly poll$ = this.pollQuery$.pipe(
    map((pollQuery) => pollQuery.data),
  );

  protected readonly isExpired$ = this.poll$.pipe(
    filter((poll) => poll != null),
    map((poll) => isBefore(poll.expiresAt, new Date())),
  );

  private readonly hasVoted$ = this.poll$.pipe(map((poll) => poll?.hasVoted));

  protected readonly isDisabled$ = combineLatest([
    this.hasVoted$,
    this.isExpired$,
  ]).pipe(map(([hasVoted, isExpired]) => hasVoted || isExpired));

  private readonly vote = inject(Vote);

  private readonly destroyed$ = new Subject<void>();

  protected readonly formGroup = new FormGroup({
    optionId: new FormControl<string | null>(null),
  });

  ngOnInit() {
    this.poll$.pipe(takeUntil(this.destroyed$)).subscribe((poll) => {
      this.formGroup.patchValue({
        optionId: poll?.options[0]?.id ?? null,
      });
    });
    this.isDisabled$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isDisabled) => {
        if (isDisabled) {
          this.formGroup.disable();
        } else {
          this.formGroup.enable();
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  protected submitForm() {
    this.poll$
      .pipe(
        take(1),
        map((poll) => ({
          optionId: this.formGroup.controls.optionId.value,
          pollId: poll?.id,
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
    this.poll$.pipe(take(1)).subscribe((poll) => {
      if (poll?.id) {
        this.pollQueries.likePoll(poll.id).mutate(liked);
      }
    });
  }

  protected bookmark(bookmarked: boolean) {
    this.poll$.pipe(take(1)).subscribe((poll) => {
      if (poll?.id) {
        this.pollQueries.bookmarkPoll(poll.id).mutate(bookmarked);
      }
    });
  }
}
