import { PollApi } from '@/services/poll-api';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-poll-list',
  imports: [CommonModule, NzCardModule, NzRadioModule, RouterLink],
  templateUrl: './poll-list.html',
})
export class PollList {
  private readonly pollApi = inject(PollApi);

  protected readonly polls = this.pollApi.getPollList();
}
