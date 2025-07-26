import { PollList } from '@/components/poll-list';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-page',
  imports: [PollList],
  template: ` <app-poll-list /> `,
})
export class MainPage {}
