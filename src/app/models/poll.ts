import { Option } from './option';
import { User } from './user';

export interface Poll {
  id: string;
  question: string;
  description?: string;
  createdAt: Date;
  createdBy: User;
  options: Option[];
  hasVoted?: boolean;
  likedByMe?: boolean;
  commentCount: number;
}
