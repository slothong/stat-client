import { Component, inject } from '@angular/core';
import { HasErrorRoot } from '../directives/has-error-root';
import { combineLatest, EMPTY, map, startWith, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'mat-error[zod-error]',
  template: `{{ error$ | async }}`,
  imports: [AsyncPipe],
})
export class ZodError {
  readonly hasErrorRoot = inject(HasErrorRoot);

  private status$ = this.hasErrorRoot.formControl$.pipe(
    switchMap((control) =>
      (control?.statusChanges ?? EMPTY).pipe(startWith(null))
    )
  );

  protected readonly error$ = combineLatest([
    this.hasErrorRoot.formControl$,
    this.status$,
  ]).pipe(
    map(([control]) => {
      return control?.getError('zodError');
    })
  );
}
