import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);

  register(email: string, password: string) {
    return this.http.post('/api/register', { email, password });
  }
}
