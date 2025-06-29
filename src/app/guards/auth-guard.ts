import { Auth } from '@/services/auth';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);

  return authService.isAuthenticated();
};
