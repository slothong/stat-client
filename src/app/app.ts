import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@/components/header';
import { AuthManager } from './services/auth-manager';
import { catchError, map, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ToastContainer } from './components/ui/toast/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, AsyncPipe, ToastContainer],
  template: `
    @if (authInitialized | async) {
      <header>
        <app-header />
      </header>
      <div class="h-[1px] w-full bg-gray-200"></div>
      <main>
        <div class="drawer drawer-open">
          <input type="checkbox" class="drawer-toggle" />
          <div class="drawer-content">
            <div class="w-2xl mx-auto pt-8">
              <router-outlet></router-outlet>
            </div>
          </div>
          <div class="drawer-side border-r border-gray-200">
            <div class="w-3xs">Sidebar</div>
          </div>
        </div>
      </main>
      <app-toast-container />
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
