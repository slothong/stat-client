import { OptionDto } from './option-dto';

export interface PollDto {
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
  likedByMe?: boolean;
  commentCount: number;
  bookmarkedByMe?: boolean;
}
