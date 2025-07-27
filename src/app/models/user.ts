import { UserDto } from './user-dto';

export class User {
  readonly id: string;
  readonly username: string;
  readonly avatarUrl?: string;
  readonly about?: string;

  constructor(
    id: string,
    username: string,
    avatarUrl: string | undefined,
    about: string | undefined,
  ) {
    this.id = id;
    this.username = username;
    this.avatarUrl = avatarUrl;
    this.about = about;
  }

  static fromDto(dto: UserDto) {
    return new User(dto.id, dto.username, dto.avatarUrl, dto.about);
  }
}
