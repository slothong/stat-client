import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDto } from '@/models/user-dto';
import { User } from '@/models/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private readonly http = inject(HttpClient);

  getMe$() {
    return this.http
      .get<UserDto>('/api/users/me')
      .pipe(map((userDto) => User.fromDto(userDto)));
  }
}
