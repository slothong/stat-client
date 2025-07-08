import { PollCreateForm } from '@/components/poll-create-form/poll-create-form';
import { Component } from '@angular/core';

@Component({
  selector: 'app-create-poll-page',
  imports: [PollCreateForm],
  template: ` <app-poll-create-form /> `,
})
export class CreatePollPage {}
