import { UserQueries } from '@/services/user-queries';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { ImageInput } from './ui/image-input';
import { ToastManager } from './ui/toast/toast-manager';

@Component({
  selector: 'app-user-setting-form',
  imports: [AsyncPipe, ReactiveFormsModule, ImageInput],
  template: `
    <form (ngSubmit)="onSubmit()" [formGroup]="formGroup">
      <div class="flex gap-5">
        <app-image-input
          formControlName="avatarFile"
          [defaultImageUrl]="(avatarUrl$ | async) ?? undefined"
        />
        <div class="flex flex-col gap-2 grow">
          <label class="input floating-label box-border w-full">
            <span> Username </span>
            <input
              type="text"
              formControlName="username"
              placeholder="Username"
            />
          </label>
          <textarea
            class="textarea w-full box-border"
            placeholder="소개"
            formControlName="about"
          ></textarea>
          <div class="flex justify-end">
            <button class="btn btn-primary" type="submit">저장</button>
          </div>
        </div>
      </div>
    </form>
  `,
})
export class UserSettingForm {
  protected readonly formGroup = new FormGroup({
    avatarFile: new FormControl<File | null>(null),
    username: new FormControl(''),
    about: new FormControl(''),
  });

  private readonly userQueries = inject(UserQueries);

  protected readonly me$ = this.userQueries.getMe$().pipe(map((me) => me.data));

  protected readonly avatarUrl$ = this.me$.pipe(map((me) => me?.avatarUrl));

  private readonly toast = inject(ToastManager);

  constructor() {
    this.me$.subscribe((me) => {
      this.formGroup.patchValue({
        about: me?.about,
        username: me?.username,
      });
    });
  }

  protected onSubmit() {
    const { about, avatarFile, username } = this.formGroup.value;
    const formData = new FormData();

    if (about) {
      formData.append('about', about);
    }
    if (avatarFile) {
      formData.append('avatarFile', avatarFile);
    }
    if (username) {
      formData.append('username', username);
    }

    try {
      this.userQueries.updateMe().mutateAsync(formData);
      this.toast.show('성공적으로 저장했습니다.');
    } catch {
      this.toast.show('요청이 실패했습니다.');
    }
  }
}
