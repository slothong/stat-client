import { OptionDto } from './option-dto';

export interface PollDto {
  id: string;
  question: string;
  description?: string;
  expiresAt: Date;
  createdAt: string;
  createdBy: {
    userId: string;
    username: string;
    avatarUrl?: string;
  };
  options: OptionDto[];
  hasVoted?: boolean;
  likedByMe?: boolean;
  likedByCount: number;
  commentCount: number;
  bookmarkedByMe?: boolean;
}
