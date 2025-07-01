import { OptionDto } from './option-dto';

export class Option {
  readonly id: string;
  readonly optionText: string;
  readonly votes: number;

  constructor({
    id,
    optionText,
    votes,
  }: {
    id: string;
    optionText: string;
    votes: number;
  }) {
    this.id = id;
    this.optionText = optionText;
    this.votes = votes;
  }

  static fromDto(dto: OptionDto) {
    return new Option({
      id: dto.id,
      optionText: dto.optionText,
      votes: dto.votes,
    });
  }
}
