import { PollApi } from '@/services/poll-api';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-poll-list',
  templateUrl: './poll-list.html',
  styleUrl: './poll-list.scss',
  imports: [CommonModule],
})
export class PollList {
  private readonly pollApi = inject(PollApi);

  protected readonly polls = this.pollApi.getPollList();
}
