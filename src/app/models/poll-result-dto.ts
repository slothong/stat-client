export type PollResultDto = {
  pollId: string;
  question: string;
  description?: string;
  options: {
    id: string;
    optionText: string;
    voteCount: number;
    votedByMe: boolean;
  }[];
};
