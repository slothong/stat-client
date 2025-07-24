import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import z from 'zod';

export const zodValidator = (schema: z.ZodType<any, any>) => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const result = schema.safeParse(formGroup.value);

    const issues = result.error?.issues;

    if (formGroup instanceof FormGroup) {
      Object.keys(formGroup.controls).forEach((key) => {
        const control = formGroup.get(key);
        control?.setErrors(null);
      });
    }

    if (!issues) return null;

    for (const issue of issues) {
      const message = issue.message;

      const control = formGroup.get(issue.path.join('.'));
      if (control) {
        control.setErrors({ zodError: message });
      }
    }
    return null;
  };
};
