import { Component, computed, contentChild, effect } from '@angular/core';
import {
  FormControl,
  FormControlDirective,
  FormControlName,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-form-field',
  template: `<ng-content></ng-content>`,
})
export class FormField {
  readonly formControlDirective = contentChild(FormControlDirective);

  readonly formControlName = contentChild(FormControlName);

  readonly formControl = computed(
    () => this.formControlDirective() || this.formControlName()?.control,
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
