import { Option } from '@/models/option';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OptionApi {
  private readonly http = inject(HttpClient);

  updateOption(option: Option) {
    return this.http.put(`/api/options/${option.id}`, option);
  }
}
