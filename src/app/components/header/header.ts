import { Component, inject } from '@angular/core';
import { AuthManager } from '@/services/auth-manager';
import { MeStore } from '@/services/me-store';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [RouterLink, NzButtonModule, NzFlexModule],
})
export class Header {
  private readonly auth = inject(AuthManager);

  protected readonly me = inject(MeStore).user;

  protected readonly isAuthenticated = inject(AuthManager).isAuthenticated;

  protected logout() {
    this.auth.logout();
  }
}
