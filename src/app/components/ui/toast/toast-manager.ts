import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ToastData {
  id: number;
  message: string;
  state: 'idle' | 'appear' | 'disappear';
}

@Injectable({
  providedIn: 'root',
})
export class ToastManager {
  private index = 0;

  private readonly messagesSubject$ = new BehaviorSubject<ToastData[]>([]);

  readonly messages$ = this.messagesSubject$.asObservable();

  show(message: string) {
    const newIndex = this.index++;
    this.messagesSubject$.next([
      ...this.messagesSubject$.getValue(),
      {
        id: newIndex,
        message,
        state: 'appear',
      },
    ]);
    setTimeout(() => {
      this.messagesSubject$.next(
        this.messagesSubject$.getValue().map((data) =>
          data.id !== newIndex
            ? data
            : {
                ...data,
                state: 'idle',
              },
        ),
      );
      setTimeout(() => {
        this.messagesSubject$.next(
          this.messagesSubject$.getValue().map((data) =>
            data.id !== newIndex
              ? data
              : {
                  ...data,
                  state: 'disappear',
                },
          ),
        );
        setTimeout(() => {
          this.messagesSubject$.next(
            this.messagesSubject$
              .getValue()
              .filter((data) => data.id !== newIndex),
          );
        }, 200);
      }, 1600);
    }, 200);
  }
}
