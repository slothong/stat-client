import { AsyncPipe } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-image-input',
  imports: [AsyncPipe, NgIcon],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ImageInput,
      multi: true,
    },
  ],
  host: {
    '(click)': 'onClick()',
    class: 'relative group w-fit h-fit rounded-full overflow-hidden',
  },
  template: `
    <div
      class="avatar avatar-placeholder cursor-pointer"
      role="button"
      tabindex="0"
    >
      <div class="bg-neutral text-neutral-content text-lg w-20 rounded-full">
        @let imageUrl = (imageUrl$ | async) ?? defaultImageUrl();
        @if (imageUrl) {
          <img [src]="imageUrl" alt="image" />
        } @else {
          <ng-icon name="heroUser" size="30" />
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
      #input
      (change)="onImagePicked($event)"
    />
  `,
})
export class ImageInput implements ControlValueAccessor {
  readonly defaultImageUrl = input<string>();

  private onChange?: (file: File | undefined) => void;

  protected imageUrl$ = new BehaviorSubject<string | null>(null);

  constructor() {
    effect(() => {
      console.log(this.defaultImageUrl());
    });
  }

  async writeValue(value: File): Promise<void> {
    this.imageUrl$.next(value ? await this.fileToBase64(value) : null);
  }

  registerOnChange(fn: (file: File | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {}

  private readonly inputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('input');

  protected onClick() {
    this.inputRef().nativeElement.click();
  }

  protected async onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.imageUrl$.next(file ? await this.fileToBase64(file) : null);
    this.onChange?.(file);
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }
}
