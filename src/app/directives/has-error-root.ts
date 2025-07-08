import { computed, contentChild, Directive, effect } from '@angular/core';
import {
  FormControl,
  FormControlDirective,
  FormControlName,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: 'mat-form-field',
})
export class HasErrorRoot {
  readonly formControlDirective = contentChild(FormControlDirective);

  readonly formControlName = contentChild(FormControlName);

  readonly formControl = computed(
    () => this.formControlDirective() || this.formControlName()?.control
  );

  private readonly formControlSubject$ =
    new BehaviorSubject<FormControl | null>(null);

  readonly formControl$ = this.formControlSubject$.asObservable();

  constructor() {
    effect(() => {
      const formControl =
        this.formControlDirective()?.control || this.formControlName()?.control;
      if (formControl) {
        this.formControlSubject$.next(formControl);
      }
    });
  }
}
