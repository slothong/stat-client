export interface Comment {
  id: string;
  pollId: string;
  author: {
    userId: string;
    username: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
