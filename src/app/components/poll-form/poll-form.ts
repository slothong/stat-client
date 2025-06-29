import { Component, inject } from '@angular/core';
import { HlmFormFieldModule } from '../ui/ui-form-field-helm/src/index';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HlmInputModule } from '../ui/ui-input-helm/src';
import { HlmRadioGroupModule } from '../ui/ui-radio-group-helm/src';
import { HlmButtonModule } from '../ui/ui-button-helm/src';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMinus } from '@ng-icons/lucide';
import { HlmIconDirective } from '../ui/ui-icon-helm/src';
import { Poll } from '@/services/poll';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-form',
  imports: [
    HlmFormFieldModule,
    ReactiveFormsModule,
    HlmInputModule,
    HlmRadioGroupModule,
    HlmButtonModule,
    HlmIconDirective,
    NgIconComponent,
  ],
  templateUrl: './poll-form.html',
  providers: provideIcons({ lucideMinus }),
})
export class PollForm {
  protected readonly formGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    options: new FormArray([
      new FormControl('', Validators.required),
      new FormControl('', Validators.required),
    ]),
  });

  private readonly poll = inject(Poll);

  private router = inject(Router);

  protected addItem() {
    this.formGroup.controls.options.push(
      new FormControl('', Validators.required)
    );
  }

  protected removeItem(index: number) {
    this.formGroup.controls.options.removeAt(index);
  }

  protected submitForm() {
    const title = this.formGroup.value.title;
    const description = this.formGroup.value.description;
    const options = this.formGroup.value.options?.filter(
      (option) => option != null
    );
    if (title == null || options == null || options.length < 2) {
      console.log(title, options);
      return;
    }

    this.poll
      .createPoll({
        question: title,
        description,
        options,
      })
      .subscribe({
        next: () => {
          toast('설문을 생성했습니다!');
          this.router.navigate(['/']);
        },
      });
  }
}
