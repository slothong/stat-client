export interface CommentDto {
  id: string;
  pollId: string;
  author: {
    userId: string;
    username: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}
