import { PollList } from '@/components/poll-list/poll-list';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.html',
  imports: [PollList],
})
export class MainPage {}
