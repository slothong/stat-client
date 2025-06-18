import { Component } from '@angular/core';
import {
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '../ui/ui-dialog-helm/src';
import { HlmFormFieldModule } from '../ui/ui-form-field-helm/src';

@Component({
  selector: 'app-login-dialog-content',
  templateUrl: './login-dialog-content.html',
  imports: [
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmFormFieldModule,
  ],
})
export class LoginDialogContentComponent {}
