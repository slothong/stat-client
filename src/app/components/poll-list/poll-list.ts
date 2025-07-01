import { PollApi } from '@/services/poll-api';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmCardModule } from '@ui/card';
import { HlmRadioGroupModule } from '@ui/radio-group';
import clsx, { ClassValue } from 'clsx';

@Component({
  selector: 'app-poll-list',
  imports: [CommonModule, HlmCardModule, HlmRadioGroupModule, RouterLink],
  templateUrl: './poll-list.html',
  host: {
    '[class]': 'computedClass()',
  },
})
export class PollList {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => {
    return clsx('flex flex-col gap-8', this.userClass());
  });

  private readonly pollApi = inject(PollApi);

  protected readonly polls = this.pollApi.getPollList();
}
