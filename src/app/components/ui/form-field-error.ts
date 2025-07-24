import { Component, inject } from '@angular/core';
import { combineLatest, EMPTY, map, startWith, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormField } from './form-field';

@Component({
  selector: 'app-form-field-error',
  template: `<span class="text-red-500 text-xs mt-1.5">{{
    error$ | async
  }}</span>`,
  imports: [AsyncPipe],
})
export class FormFieldError {
  readonly formField = inject(FormField);

  private status$ = this.formField.formControl$.pipe(
    switchMap((control) =>
      (control?.statusChanges ?? EMPTY).pipe(startWith(null)),
    ),
  );

  protected readonly error$ = combineLatest([
    this.formField.formControl$,
    this.status$,
  ]).pipe(
    map(([control]) => {
      return control?.getError('zodError');
    }),
  );
}
