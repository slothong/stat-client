import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-uesr-settings-page',
  imports: [
    NzTypographyModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzAvatarModule,
  ],
  template: `
    <h1 nz-typography>Settings</h1>
    <form nz-form nzLayout="vertical">
      <div class="flex gap-5">
        <div class="relative group w-fit h-fit rounded-full overflow-hidden">
          <nz-avatar nzIcon="user" [nzSize]="100" class="relative"></nz-avatar>
          <div
            class="absolute bottom-0 bg-gray-200 text-white text-center opacity-0 group-hover:opacity-70 w-full text-lg left-1/2 -translate-x-1/2 transition-opacity cursor-pointer"
          >
            Edit
          </div>
        </div>
        <div>
          <div class="flex flex-col">
            <nz-form-item>
              <nz-form-label>Username</nz-form-label>
              <nz-form-control>
                <input type="text" nz-input />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>소개</nz-form-label>
              <nz-form-control>
                <textarea nz-input></textarea>
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>
      </div>
    </form>
  `,
})
export class UserSettingsPage {}
