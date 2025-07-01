import { Option } from './option';
import { OptionDto } from './option-dto';
import { PollDto } from './poll-dto';

export class Poll {
  readonly id: string;
  readonly question: string;
  readonly description?: string;
  readonly createdAt: Date;
  readonly options: Option[];

  constructor({
    id,
    question,
    description,
    createdAt,
    options,
  }: {
    id: string;
    question: string;
    description?: string;
    createdAt: Date;
    options: OptionDto[];
  }) {
    this.id = id;
    this.question = question;
    this.description = description;
    this.createdAt = createdAt;
    this.options = options;
  }

  static fromDto(dto: PollDto) {
    return new Poll({
      id: dto.id,
      question: dto.question,
      description: dto.description,
      createdAt: new Date(dto.createdAt),
      options: dto.options.map((optionDto) => Option.fromDto(optionDto)),
    });
  }
}
