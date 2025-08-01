import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import z from 'zod';
import { zodValidator } from '@/utils/zod-validator';
import { PollQueries } from '@/services/poll-queries';
import { FormField } from './ui/form-field';
import { FormFieldError } from './ui/form-field-error';
import { NgIcon } from '@ng-icons/core';
import { ToastManager } from './ui/toast/toast-manager';
import { injectQueryClient, QueryClient } from '@ngneat/query';

const formSchema = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  duration: z.string().nonempty({ message: '투표 기간을 선택하세요.' }),
  options: z.array(z.string()),
});

@Component({
  selector: 'app-poll-create-form',
  imports: [ReactiveFormsModule, NgIcon, FormField, FormFieldError],
  template: `
    <h1>설문 작성</h1>
    <form
      [formGroup]="formGroup"
      (ngSubmit)="submitForm()"
      class="flex flex-col"
    >
      <app-form-field class="mb-5 flex flex-col">
        <select class="select w-26" formControlName="duration">
          <option disabled selected value="">투표 기간</option>
          <option value="1h">한 시간</option>
          <option value="1d">하루</option>
          <option value="3d">3일</option>
          <option value="1w">1주일</option>
        </select>
        <app-form-field-error />
      </app-form-field>
      <app-form-field class="mb-5">
        <label class="floating-label input input-lg box-border w-full">
          <span> Title </span>
          <input type="text" placeholder="Title" formControlName="title" />
        </label>
        <app-form-field-error />
      </app-form-field>
      <textarea
        formControlName="description"
        class="textarea box-border w-full mb-3"
        placeholder="Body Text (Optional)"
      ></textarea>
      <div class="flex flex-col gap-2 w-full">
        @for (option of formGroup.controls.options.controls; track option) {
          <div class="flex items-center">
            <div class="py-1 px-1 flex items-center gap-2 w-full">
              <input
                type="radio"
                class="radio radio-sm m-0"
                [disabled]="true"
              />
              <input
                [formControl]="option"
                type="text"
                class="input input-sm grow"
              />
              <button
                type="button"
                class="btn btn-circle btn-sm"
                (click)="removeItem($index)"
                [disabled]="formGroup.controls.options.controls.length <= 2"
              >
                <ng-icon name="heroMinus" size="15" />
              </button>
            </div>
          </div>
        }
      </div>
      <div class="flex flex-col gap-2 mt-3">
        <button class="btn btn-block" type="button" (click)="addItem()">
          추가
        </button>
        <button
          class="btn btn-block btn-primary"
          type="submit"
          [disabled]="!formGroup.valid"
        >
          제출
        </button>
      </div>
    </form>
  `,
})
export class PollCreateForm {
  protected readonly formGroup = new FormGroup(
    {
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      duration: new FormControl(''),
      options: new FormArray([
        new FormControl('', Validators.required),
        new FormControl('', Validators.required),
      ]),
    },
    {
      validators: zodValidator(formSchema),
    },
  );

  private readonly createPoll = inject(PollQueries).createPoll();

  private readonly router = inject(Router);

  private readonly toast = inject(ToastManager);

  private readonly queryClient = injectQueryClient();

  protected addItem() {
    this.formGroup.controls.options.push(
      new FormControl('', Validators.required),
    );
  }

  protected removeItem(index: number) {
    this.formGroup.controls.options.removeAt(index);
  }

  protected async submitForm() {
    const title = this.formGroup.value.title;
    const description = this.formGroup.value.description;
    const duration = this.formGroup.value.duration;
    const options = this.formGroup.value.options?.filter(
      (option) => option != null,
    );
    if (
      title == null ||
      options == null ||
      options.length < 2 ||
      duration == null
    ) {
      this.toast.show('생성에 실패했습니다.');
      return;
    }

    try {
      const poll = await this.createPoll.mutateAsync({
        question: title,
        description,
        duration,
        options,
      });
      this.toast.show('설문을 생성했습니다!');
      this.queryClient.invalidateQueries({
        queryKey: PollQueries.getPollsQueryKey(),
      });
      this.router.navigate(['/polls/' + poll.id]);
    } catch {
      this.toast.show('생성에 실패했습니다.');
    }
  }
}
