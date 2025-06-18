import { Component } from '@angular/core';
import {
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '../ui/ui-dialog-helm/src';

@Component({
  selector: 'app-login-dialog-content',
  templateUrl: './login-dialog-content.html',
  imports: [HlmDialogHeaderComponent, HlmDialogTitleDirective],
})
export class LoginDialogContentComponent {}
