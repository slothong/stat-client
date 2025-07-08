import { PollApi } from '@/services/poll-api';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-poll-list',
  imports: [CommonModule, RouterLink, MatCardModule, MatRadioModule],
  host: {
    class: 'flex flex-col',
  },
  template: `
    @for (poll of (polls | async); track poll) {
    <mat-card
      [routerLink]="'/polls/' + poll.id"
      class="cursor-pointer"
      appearance="outlined"
    >
      <mat-card-header>
        <mat-card-title>{{ poll.question }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="flex flex-col gap-5 pt-2">
          <div class="text-gray-500 text-sm">
            작성자: {{ poll.createdBy.username }} •
            {{ getRelativeTime(poll.createdAt) }}
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
  `,
})
export class PollList {
  private readonly pollApi = inject(PollApi);

  protected readonly polls = this.pollApi.getPollList();

  protected getRelativeTime(date: Date) {
    const now = new Date();
    const diff = (date.getTime() - now.getTime()) / 1000; // 초 단위
    const absDiff = Math.abs(diff);
    let value: number;
    let unit: Intl.RelativeTimeFormatUnit;

    if (absDiff < 60) {
      value = Math.round(diff);
      unit = 'second';
    } else if (absDiff < 3600) {
      value = Math.round(diff / 60);
      unit = 'minute';
    } else if (absDiff < 86400) {
      value = Math.round(diff / 3600);
      unit = 'hour';
    } else {
      value = Math.round(diff / 86400);
      unit = 'day';
    }

    return new Intl.RelativeTimeFormat('ko', { numeric: 'auto' }).format(
      value,
      unit
    );
  }

  protected getDateText(date: Date) {
    const now = new Date();
    const diff = (date.getTime() - now.getTime()) / 1000; // 초 단위
    const absDiff = Math.abs(diff);
    if (absDiff < 86400 * 7) return this.getRelativeTime(date);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  }
}
