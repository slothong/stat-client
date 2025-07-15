import { PollCreateForm } from '@/components/poll-create-form';
import { Component } from '@angular/core';

@Component({
  selector: 'app-create-poll-page',
  imports: [PollCreateForm],
  template: `
    <div class="w-3xl mx-auto pt-12">
      <app-poll-create-form />
    </div>
  `,
})
export class CreatePollPage {}
