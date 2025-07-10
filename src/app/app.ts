import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@/components/header';
import { AuthManager } from './services/auth-manager';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  template: `
    <header class="px-32">
      <app-header />
    </header>
    <main class="px-32">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class App implements OnInit {
  private readonly auth = inject(AuthManager);

  protected readonly authInitialized = signal(false);

  ngOnInit() {
    this.auth.refresh$().subscribe({
      next: () => this.authInitialized.set(true),
      error: () => this.authInitialized.set(true),
    });
  }
}
