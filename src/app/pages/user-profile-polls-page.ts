import { MeStore } from '@/services/me-store';
import { PollQueries } from '@/services/poll-queries';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-user-profile-polls-page',
  imports: [MatCardModule, AsyncPipe],
  template: `
    @let polls = (polls$ | async)?.data;
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>내가 작성한 설문</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @for (poll of polls; track poll.id) {
          <div>{{ poll.question }}</div>
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class UserProfilePollsPage {
  protected readonly me$ = inject(MeStore).user$;

  private pollQueries = inject(PollQueries);

  protected polls$ = this.me$.pipe(
    switchMap((me) => this.pollQueries.getPollsByUser$(me?.id)),
  );
}
