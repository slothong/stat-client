import { inject, Injectable } from '@angular/core';
import { UserApi } from './user-api';
import { injectMutation, injectQuery, injectQueryClient } from '@ngneat/query';
import { AuthManager } from './auth-manager';

@Injectable({
  providedIn: 'root',
})
export class UserQueries {
  private readonly queryClient = injectQueryClient();
  private readonly query = injectQuery();
  private readonly mutation = injectMutation();
  private readonly userApi = inject(UserApi);

  private readonly isAuthenticated$ = inject(AuthManager).isAuthenticated$;

  static getMeQueryKey() {
    return ['me'];
  }

  constructor() {
    this.isAuthenticated$.subscribe(() => {
      this.queryClient.invalidateQueries({
        queryKey: UserQueries.getMeQueryKey(),
      });
    });
  }

  getMe$() {
    return this.query({
      queryKey: UserQueries.getMeQueryKey(),
      queryFn: () => this.userApi.getMe$(),
    }).result$;
  }

  updateMe() {
    return this.mutation({
      mutationFn: (formData: FormData) => this.userApi.updateMe$(formData),
      onSuccess: () =>
        this.queryClient.invalidateQueries({
          queryKey: UserQueries.getMeQueryKey(),
        }),
    });
  }
}
