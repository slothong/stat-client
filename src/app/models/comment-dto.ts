export interface CommentDto {
  id: string;
  pollId: string;
  author: {
    userId: string;
    username: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}
