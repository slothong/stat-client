import { Component, contentChildren } from '@angular/core';
import { Card } from './card';

@Component({
  selector: 'app-card-list',
  template: ` <ng-content></ng-content> `,
})
export class CardList {
  protected readonly items = contentChildren(Card);
}
