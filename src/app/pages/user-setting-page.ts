import { BASE_API_URL } from '@/constants';
import { UserApi } from '@/services/user-api';
import { UserQueries } from '@/services/user-queries';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { map } from 'rxjs';

@Component({
  selector: 'app-uesr-settings-page',
  imports: [
    NzTypographyModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzAvatarModule,
    AsyncPipe,
  ],
  template: `
    <h1 nz-typography>Settings</h1>
    <form (ngSubmit)="onSubmit()" [formGroup]="formGroup">
      <div class="flex gap-5">
        <div class="relative group w-fit h-fit rounded-full overflow-hidden">
          <label>
            <div
              class="avatar avatar-placeholder cursor-pointer"
              role="button"
              tabindex="0"
            >
              <div
                class="bg-neutral text-neutral-content text-lg w-20 rounded-full"
              >
                @let avatarUrl = avatarUrl$ | async;
                @if (avatarUrl) {
                  <img
                    [src]="avatarUrl$ | async"
                    alt="avatar"
                    [style.width]="'100%'"
                    [style.height]="'100%'"
                  />
                } @else {
                  <span>SY</span>
                }
              </div>
            </div>
            <div
              class="absolute bottom-0 bg-gray-200 text-white text-center opacity-0 group-hover:opacity-70 w-full text-lg left-1/2 -translate-x-1/2 transition-opacity cursor-pointer"
            >
              Edit
            </div>
            <input
              type="file"
              [style.display]="'none'"
              (change)="onImagePicked($event)"
            />
          </label>
        </div>
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
