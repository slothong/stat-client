import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Header } from '@/components/header';
import { AuthManager } from './services/auth-manager';
import { catchError, map, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ToastContainer } from './components/ui/toast/toast-container';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    AsyncPipe,
    ToastContainer,
    NgIcon,
    RouterLink,
  ],
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
            <div class="min-w-2xl w-fit mx-auto pt-8">
              <router-outlet></router-outlet>
            </div>
          </div>
          <div class="drawer-side border-r border-gray-200">
            <ul class="w-3xs menu m-0">
              <li>
                <a [routerLink]="'/'" class="text-inherit no-underline">
                  <ng-icon name="heroHome" size="20" />
                  Home
                </a>
              </li>
            </ul>
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
