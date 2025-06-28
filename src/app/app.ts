import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@/components/header/header';
import { HlmToasterComponent } from '@ui/sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, HlmToasterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
