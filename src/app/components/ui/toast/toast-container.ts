import { Component, inject } from '@angular/core';
import { ToastManager } from './toast-manager';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  imports: [AsyncPipe],
  host: {
    class: 'toast toast-top toast-center',
  },
  template: `
    @let messages = messages$ | async;
    @for (message of messages; track $index) {
      <div
        [class]="
          'alert alert-success ' +
          (message.state === 'disappear'
            ? 'animate-(--animate-slide-out)'
            : 'animate-(--animate-slide-in)')
        "
      >
        {{ message.message }}
      </div>
    }
  `,
})
export class ToastContainer {
  readonly messages$ = inject(ToastManager).messages$;
}
