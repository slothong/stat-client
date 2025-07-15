import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  template: '<ng-content></ng-content>',
  host: {
    class: 'hover:bg-gray-50 rounded-xl flex flex-col py-1 px-3 cursor-pointer',
  },
})
export class Card {}
