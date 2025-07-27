import { UserSettingForm } from '@/components/user-setting-form';
import { Component } from '@angular/core';

@Component({
  selector: 'app-uesr-settings-page',
  imports: [UserSettingForm],
  template: `
    <h1 class="mt-0">Settings</h1>
    <app-user-setting-form />
  `,
})
export class UserSettingsPage {}
