import { OptionDto } from './option-dto';

export type PollDto = {
  id: string;
  question: string;
  description?: string;
  createdAt: string;
  options: OptionDto[];
  hasVoted?: boolean;
};
