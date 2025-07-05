import { OptionDto } from './option-dto';

export type PollDto = {
  id: string;
  question: string;
  description?: string;
  createdAt: string;
  createdBy: {
    userId: string;
    username: string;
  };
  options: OptionDto[];
  hasVoted?: boolean;
};
