import { Option } from './option';
import { PollDto } from './poll-dto';

export class Poll {
  readonly id: string;
  readonly question: string;
  readonly description?: string;
  readonly createdAt: Date;
  readonly options: Option[];
  readonly hasVoted: boolean;

  constructor({
    id,
    question,
    description,
    createdAt,
    options,
    hasVoted,
  }: {
    id: string;
    question: string;
    description?: string;
    createdAt: Date;
    options: Option[];
    hasVoted?: boolean;
  }) {
    this.id = id;
    this.question = question;
    this.description = description;
    this.createdAt = createdAt;
    this.options = options;
    this.hasVoted = !!hasVoted;
  }

  static fromDto(dto: PollDto) {
    return new Poll({
      id: dto.id,
      question: dto.question,
      description: dto.description,
      createdAt: new Date(dto.createdAt),
      options: dto.options.map((optionDto) => Option.fromDto(optionDto)),
      hasVoted: dto.hasVoted,
    });
  }
}
