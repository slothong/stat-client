import { UserDto } from './user-dto';

export class User {
  readonly id: string;
  readonly username: string;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
  }

  static fromDto(dto: UserDto) {
    return new User(dto.userId, dto.username);
  }
}
