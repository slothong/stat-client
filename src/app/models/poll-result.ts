export interface PollResult {
  pollId: string;
  question: string;
  description?: string;
  options: {
    id: string;
    optionText: string;
    voteCount: number;
    votedByMe: boolean;
  }[];
}
