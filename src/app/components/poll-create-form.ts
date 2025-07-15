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
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Poll } from '@/models/poll';

const formSchema = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  options: z.array(z.string()),
});

@Component({
  selector: 'app-poll-create-form',
  imports: [
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzRadioModule,
    NzIconModule,
    NzTypographyModule,
  ],
  template: `
    <h1 nz-typography>설문 작성</h1>
    <form
      nz-form
      [formGroup]="formGroup"
      (ngSubmit)="submitForm()"
      class="flex flex-col"
      nzLayout="vertical"
    >
      <nz-form-item>
        <nz-form-label nzRequired nzFor="title">Title</nz-form-label>
        <nz-form-control nzErrorTip="제목을 입력하세요">
          <input nz-input formControlName="title" id="title" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label nzFor="description" nzRequired
          >Description</nz-form-label
        >
        <nz-form-control nzErrorTip="내용을 입력하세요">
          <textarea
            nz-input
            id="description"
            formControlName="description"
          ></textarea>
        </nz-form-control>
      </nz-form-item>
      <div class="flex flex-col gap-3 w-full">
        @for (option of formGroup.controls.options.controls; track option) {
          <div class="flex items-center">
            <span nz-radio [nzDisabled]="true"></span>
            <div class="flex grow-1 gap-1">
              <nz-form-control class="grow">
                <input nz-input [formControl]="option" type="text" />
              </nz-form-control>
              <button
                nz-button
                (click)="removeItem($index)"
                [disabled]="formGroup.controls.options.controls.length <= 2"
                class="mt-2"
              >
                <nz-icon nzType="minus" />
              </button>
            </div>
          </div>
        }
      </div>
      <div class="flex flex-col gap-2 mt-3">
        <button nz-button type="button" (click)="addItem()">추가</button>
        <button
          nz-button
          nzType="primary"
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

  private readonly message = inject(NzMessageService);

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
    const options = this.formGroup.value.options?.filter(
      (option) => option != null,
    );
    if (title == null || options == null || options.length < 2) {
      this.message.error('생성에 실패했습니다.');
      return;
    }

    try {
      const poll = await this.createPoll.mutateAsync({
        question: title,
        description,
        options,
      });
      this.message.success('설문을 생성했습니다!');
      this.router.navigate(['/polls/' + poll.id]);
    } catch {
      this.message.error('생성에 실패했습니다.');
    }
  }
}
