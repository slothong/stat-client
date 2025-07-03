import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@/components/header/header';
import { HlmToasterComponent } from '@ui/sonner';
import { AuthManager } from './services/auth-manager';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, HlmToasterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    class: 'flex flex-col h-full',
  },
})
export class App implements OnInit {
  private readonly auth = inject(AuthManager);

  protected readonly authInitialized = signal(false);

  ngOnInit() {
    this.auth.refresh().subscribe(() => {
      this.authInitialized.set(true);
    });
  }
}
