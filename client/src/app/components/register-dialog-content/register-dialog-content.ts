import { Component } from '@angular/core';
import {
  HlmDialogContentComponent,
  HlmDialogHeaderComponent,
} from '@ui/dialog';
import { HlmFormFieldComponent } from '@ui/form-field';
import { HlmInputDirective } from '@ui/input';
import { HlmButtonDirective } from '@ui/button';

@Component({
  selector: 'app-register-dialog-content',
  templateUrl: './register-dialog-content.html',
  imports: [
    HlmDialogHeaderComponent,
    HlmFormFieldComponent,
    HlmInputDirective,
    HlmButtonDirective,
  ],
})
export class RegisterDialogContentComponent {}
