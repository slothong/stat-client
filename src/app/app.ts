import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@/components/header/header';
import { HlmToasterComponent } from '@ui/sonner';
import { AuthManager } from './services/auth-manager';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, HlmToasterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly auth = inject(AuthManager);

  ngOnInit() {
    this.auth.refresh().subscribe();
  }
}
