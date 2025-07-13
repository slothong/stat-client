import { Pipe, PipeTransform } from '@angular/core';

export const getRelativeDateText = (date: Date) => {
  const now = new Date();
  const diff = (date.getTime() - now.getTime()) / 1000; // 초 단위
  const absDiff = Math.abs(diff);
  if (absDiff < 86400 * 7) return getRelativeTime(date);
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

export const getRelativeTime = (date: Date) => {
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
    unit,
  );
};

@Pipe({
  name: 'relativeDate',
})
export class RelativeDatePipe implements PipeTransform {
  transform(date?: Date): string {
    if (!date) return '';
    return getRelativeDateText(date);
  }
}
