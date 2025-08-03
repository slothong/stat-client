import { Comment } from '@/models/comment';
import { RelativeDatePipe } from '@/pipes/relative-date.pipe';
import { AsyncPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NgIcon } from '@ng-icons/core';
import { Avatar } from './ui/avatar';
import { BehaviorSubject, filter, take } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastManager } from './ui/toast/toast-manager';

@Component({
  selector: 'app-comment-card',
  imports: [RelativeDatePipe, AsyncPipe, NgIcon, Avatar, ReactiveFormsModule],
  template: `
    @let comment = comment$ | async;
    @if (comment) {
      <div class="flex items-center gap-2">
        <app-avatar [avatarUrl]="comment.author.avatarUrl" size="sm" />
        <span class="text-sm">{{ comment.author.username }}</span>
        <span class="text-gray-500 text-xs">
          •
          {{ comment.createdAt | relativeDate }}
        </span>
      </div>
      <div class="py-3">
        {{ comment.content }}
      </div>
      <div class="flex gap-1">
        <button type="button" class="btn btn-sm btn-ghost font-normal">
          <ng-icon name="heroHeart" size="15" />
          0
        </button>
        <button
          type="button"
          class="btn btn-sm btn-ghost font-normal"
          (click)="toggleOpenReply()"
        >
          <ng-icon name="heroChatBubbleOvalLeft" size="15" />
          Reply to
        </button>
      </div>
      @if (replyOpen$ | async) {
        <form [formGroup]="formGroup" (ngSubmit)="submitForm()">
          <textarea
            class="box-border w-full textarea"
            formControlName="content"
          ></textarea>
          <div class="flex justify-end">
            <button
              class="btn btn-primary"
              type="submit"
              [disabled]="!formGroup.valid"
            >
              작성
            </button>
          </div>
        </form>
      }

      <div class="px-8 flex flex-col gap-3 mt-5">
        @for (reply of comment.replies; track reply.id) {
          <div>
            <div class="flex items-center gap-2">
              <app-avatar [avatarUrl]="comment.author.avatarUrl" size="sm" />
              <span class="text-sm">{{ comment.author.username }}</span>
              <span class="text-gray-500 text-xs">
                •
                {{ reply.createdAt | relativeDate }}
              </span>
            </div>
            <div class="py-3">
              {{ reply.content }}
            </div>
            <div class="flex gap-1">
              <button type="button" class="btn btn-sm btn-ghost font-normal">
                <ng-icon name="heroHeart" size="15" />
                0
              </button>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class CommentCard {
  readonly comment = input<Comment>();
  protected readonly comment$ = toObservable(this.comment);

  protected readonly replyOpen$ = new BehaviorSubject(false);

  protected readonly formGroup = new FormGroup({
    content: new FormControl('', [Validators.required]),
  });

  readonly createReply = output<string>();

  private readonly toast = inject(ToastManager);

  protected submitForm() {
    const { content } = this.formGroup.value;
    if (content == null || content.trim().length === 0) {
      this.toast.show('Content must not be empty');
      return;
    }
    this.formGroup.patchValue({ content: '' });
    this.replyOpen$.next(false);
    this.createReply.emit(content);
  }

  protected toggleOpenReply() {
    this.replyOpen$.next(!this.replyOpen$.getValue());
  }
}
