import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { PollQueries } from '@/services/poll-queries';
import { getRelativeDateText } from '@/utils/date';

@Component({
  selector: 'app-poll-list',
  imports: [CommonModule, RouterLink, MatCardModule, MatRadioModule],
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
          <mat-card
            [routerLink]="'/polls/' + poll.id"
            class="cursor-pointer hover:ring-2! hover:ring-blue-100 transition-all duration-300"
            appearance="outlined"
          >
            <mat-card-header>
              <mat-card-title>{{ poll.question }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="flex flex-col gap-5 pt-2">
                <div class="text-gray-500 text-sm">
                  작성자: {{ poll.createdBy.username }} •
                  {{ getDateText(poll.createdAt) }}
                </div>
                <mat-radio-group class="flex flex-col">
                  @for (option of poll.options; track option) {
                    <mat-radio-button [value]="option.id">
                      {{ option.optionText }}
                    </mat-radio-button>
                  }
                </mat-radio-group>
              </div>
            </mat-card-content>
          </mat-card>
        }
      }
    }
  `,
})
export class PollList {
  protected readonly pollList$ = inject(PollQueries).getPolls$();

  protected getDateText(date: Date) {
    return getRelativeDateText(date);
  }
}
