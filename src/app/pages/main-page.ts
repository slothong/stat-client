import { PollFeed } from '@/components/poll-feed';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-page',
  imports: [PollFeed],
  host: {
    class: 'h-full max-h-full',
  },
  template: ` <app-poll-feed class="w-5xl" /> `,
})
export class MainPage {}
