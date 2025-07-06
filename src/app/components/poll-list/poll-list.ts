import { PollApi } from '@/services/poll-api';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'app-poll-list',
  imports: [
    CommonModule,
    NzCardModule,
    NzRadioModule,
    RouterLink,
    NzListModule,
    NzTypographyModule,
    NzCardModule,
    NzSpaceModule,
  ],
  templateUrl: './poll-list.html',
  styleUrl: './poll-list.scss',
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
