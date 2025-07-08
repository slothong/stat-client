import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PollApi } from '@/services/poll-api';
import { Router } from '@angular/router';
import z from 'zod';
import { zodValidator } from '@/utils/zod-validator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

const formSchema = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  options: z.array(z.string()),
});

@Component({
  selector: 'app-poll-create-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  template: `
    <form
      [formGroup]="formGroup"
      (ngSubmit)="submitForm()"
      class="flex flex-col"
    >
      <mat-form-field>
        <mat-label>Title</mat-label>
        <input
          matInput
          type="text"
          placeholder="Title"
          formControlName="title"
        />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Description</mat-label>
        <textarea
          matInput
          placeholder="Description"
          formControlName="description"
        ></textarea>
      </mat-form-field>
      <mat-radio-group>
        <div class="flex flex-col">
          @for (option of formGroup.controls.options.controls; track option) {
          <div class="flex items-start gap-2">
            <mat-radio-button [disabled]="true" class="mt-2" />
            <mat-form-field class="flex-1">
              <input matInput type="text" [formControl]="option" />
            </mat-form-field>

            <button
              matIconButton
              (click)="removeItem($index)"
              [disabled]="formGroup.controls.options.controls.length <= 2"
              class="mt-2"
            >
              <mat-icon>remove</mat-icon>
            </button>
          </div>
          }
        </div>
      </mat-radio-group>
      <div class="flex flex-col gap-2">
        <button matButton="text" (click)="addItem()">추가</button>
        <button matButton="filled" type="submit" [disabled]="!formGroup.valid">
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
    }
  );

  private readonly poll = inject(PollApi);

  private readonly snackbar = inject(MatSnackBar);

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
      this.snackbar.open('생성에 실패했습니다.');
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
          this.snackbar.open('설문을 생성했습니다!');
          this.router.navigate(['/']);
        },
      });
  }
}
