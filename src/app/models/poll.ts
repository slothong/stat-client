import { PollDto } from './poll-dto';

export class Poll {
  readonly id: string;
  readonly question: string;
  readonly createdAt: Date;
  readonly options: string[];

  constructor({
    id,
    question,
    createdAt,
    options,
  }: {
    id: string;
    question: string;
    createdAt: Date;
    options: string[];
  }) {
    this.id = id;
    this.question = question;
    this.createdAt = createdAt;
    this.options = options;
  }

  static fromDto(dto: PollDto) {
    return new Poll({
      id: dto.id,
      question: dto.question,
      createdAt: new Date(dto.createdAt),
      options: dto.options,
    });
  }
}
