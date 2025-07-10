import { AuthManager } from '@/services/auth-manager';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { lastValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthManager);

  return lastValueFrom(authService.isAuthenticated$);
};
