import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Vote } from '@/services/vote';
import { PollResult } from '../poll-result/poll-result';
import { PollStore } from '@/services/poll-store';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'app-poll-detail',
  imports: [
    AsyncPipe,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzButtonModule,
    NzCardModule,
    NzSpaceModule,
    ReactiveFormsModule,
    PollResult,
  ],
  templateUrl: './poll-detail.html',
  styleUrl: './poll-detail.scss',
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
