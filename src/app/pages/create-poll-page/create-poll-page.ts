import { PollForm } from '@/components/poll-form/poll-form';
import { Component } from '@angular/core';

@Component({
  selector: 'app-create-poll-page',
  templateUrl: './create-poll-page.html',
  imports: [PollForm],
})
export class CreatePollPage {}
