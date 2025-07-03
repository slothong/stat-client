import { PollApi } from '@/services/poll-api';
import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, tap } from 'rxjs';
import { HlmRadioGroupModule } from '@ui/radio-group';
import {
  HlmCardContentDirective,
  HlmCardDirective,
  HlmCardHeaderDirective,
} from '@ui/card';
import { HlmButtonDirective } from '@ui/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Vote } from '@/services/vote';
import { PollResult } from '../poll-result/poll-result';
import { Router } from '@angular/router';
import { PollStore } from '@/services/poll-store';

@Component({
  selector: 'app-poll-detail',
  imports: [
    AsyncPipe,
    HlmRadioGroupModule,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardContentDirective,
    HlmButtonDirective,
    ReactiveFormsModule,
    HlmCardHeaderDirective,
    PollResult,
  ],
  templateUrl: './poll-detail.html',
})
export class PollDetail {
  readonly pollId = input<string | null>();
  private readonly pollStore = inject(PollStore);
  private readonly vote = inject(Vote);

  protected readonly poll$ = toObservable(this.pollId).pipe(
    filter((pollId) => pollId != null),
    switchMap((pollId) => this.pollStore.getPoll$(pollId))
  );

  protected formGroup = new FormGroup({
    optionId: new FormControl<string | null>(null),
  });

  protected submitForm() {
    const pollId = this.pollId();
    if (pollId == null) return;

    const optionId = this.formGroup.controls.optionId.value;

    if (optionId == null) return;

    this.vote.vote(pollId, optionId).subscribe();
  }
}
