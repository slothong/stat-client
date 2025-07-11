import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-like-button',
  imports: [MatIconModule, MatButtonModule, AsyncPipe],
  template: `
    @let liked = !!(liked$ | async);
    <button
      matIconButton
      aria-label="Like this poll"
      (click)="likedChange.emit(!liked)"
    >
      @if (liked) {
        <mat-icon fontSet="material-icons-outlined">favorite</mat-icon>
      } @else {
        <mat-icon fontSet="material-icons-outlined">favorite_border</mat-icon>
      }
    </button>
  `,
})
export class LikeButton {
  @Input()
  set liked(value: boolean) {
    this.liked$.next(value);
  }

  @Output() likedChange = new EventEmitter<boolean>();

  protected readonly liked$ = new ReplaySubject<boolean>(1);
}
