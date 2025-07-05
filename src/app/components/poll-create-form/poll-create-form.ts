import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PollApi } from '@/services/poll-api';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-poll-create-form',
  imports: [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzRadioModule,
    ReactiveFormsModule,
  ],
  templateUrl: './poll-create-form.html',
})
export class PollCreateForm {
  protected readonly formGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    options: new FormArray([
      new FormControl('', Validators.required),
      new FormControl('', Validators.required),
    ]),
  });

  private readonly poll = inject(PollApi);

  private readonly message = inject(NzMessageService);

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
      this.message.error('생성에 실패했습니다.');
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
          this.message.success('설문을 생성했습니다!');
          this.router.navigate(['/']);
        },
      });
  }
}
