import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@/components/header';
import { AuthManager } from './services/auth-manager';
import { catchError, finalize, map, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, AsyncPipe],
  template: `
    @if (authInitialized | async) {
      <header class="px-32">
        <app-header />
      </header>
      <main class="px-32">
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
