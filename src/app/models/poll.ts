import { Option } from './option';
import { User } from './user';

export interface Poll {
  id: string;
  question: string;
  description?: string;
  expiresAt: Date;
  createdAt: Date;
  createdBy: User;
  options: Option[];
  hasVoted?: boolean;
  likedByMe?: boolean;
  likedByCount: number;
  commentCount: number;
  bookmarkedByMe?: boolean;
}
