import { PollCreateForm } from '@/components/poll-create-form/poll-create-form';
import { Component } from '@angular/core';

@Component({
  selector: 'app-create-poll-page',
  templateUrl: './create-poll-page.html',
  imports: [PollCreateForm],
})
export class CreatePollPage {}
