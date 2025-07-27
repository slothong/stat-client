import { ImageInput } from '@/components/ui/image-input';
import { UserQueries } from '@/services/user-queries';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-uesr-settings-page',
  imports: [ReactiveFormsModule, AsyncPipe, ImageInput],
  template: `
    <h1>Settings</h1>
    <form (ngSubmit)="onSubmit()" [formGroup]="formGroup">
      <div class="flex gap-5">
        <app-image-input
          formControlName="avatarFile"
          [defaultImageUrl]="(avatarUrl$ | async) ?? undefined"
        />
        <div>
          <div class="flex flex-col">
            <label class="input floating-label">
              <span> Username </span>
              <input
                type="text"
                formControlName="username"
                placeholder="Username"
              />
            </label>
            <textarea
              class="textarea"
              placeholder="소개"
              formControlName="about"
            ></textarea>
          </div>
        </div>
      </div>
      <button class="btn btn-primary" type="submit">저장</button>
    </form>
  `,
})
export class UserSettingsPage {
  protected readonly formGroup = new FormGroup({
    avatarFile: new FormControl<File | null>(null),
    username: new FormControl(''),
    about: new FormControl(''),
  });

  private readonly userQueries = inject(UserQueries);

  protected readonly me$ = this.userQueries.getMe$().pipe(map((me) => me.data));

  protected readonly avatarUrl$ = this.me$.pipe(map((me) => me?.avatarUrl));

  constructor() {
    this.me$.subscribe((me) => {
      this.formGroup.patchValue({
        about: me?.about,
        username: me?.username,
      });
    });
  }

  protected onSubmit() {
    const { about, avatarFile } = this.formGroup.value;
    const formData = new FormData();
    if (about) {
      formData.append('about', about);
    }
    if (avatarFile) {
      formData.append('avatarFile', avatarFile);
    }

    this.userQueries.updateMe().mutate(formData);
  }

  protected onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.formGroup.patchValue({ avatarFile: file });
  }
}
