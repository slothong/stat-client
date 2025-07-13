import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@/components/header';
import { AuthManager } from './services/auth-manager';
import { catchError, map, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, AsyncPipe, NzDividerModule],
  template: `
    @if (authInitialized | async) {
      <header>
        <app-header />
      </header>
      <div class="h-[1px] w-full bg-gray-200"></div>
      <main>
        <router-outlet></router-outlet>
      </main>
    }
  `,
})
export class App {
  protected readonly authInitialized = inject(AuthManager)
    .refresh$()
    .pipe(
      map(() => true),
      catchError(() => of(true)),
    );
}
