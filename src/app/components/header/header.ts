import { Component, inject } from '@angular/core';
import { AuthManager } from '@/services/auth-manager';
import { MeStore } from '@/services/me-store';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [RouterLink, NzButtonModule, NzFlexModule, NzSpaceModule],
  styles: [
    `
      :host {
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
      }
    `,
  ],
})
export class Header {
  private readonly auth = inject(AuthManager);

  protected readonly me = inject(MeStore).user;

  protected readonly isAuthenticated = inject(AuthManager).isAuthenticated;

  protected logout() {
    this.auth.logout();
  }
}
