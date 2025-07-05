import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@/components/header/header';
import { AuthManager } from './services/auth-manager';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly auth = inject(AuthManager);

  protected readonly authInitialized = signal(false);

  ngOnInit() {
    this.auth.refresh().subscribe({
      next: () => this.authInitialized.set(true),
      error: () => this.authInitialized.set(true),
    });
  }
}
