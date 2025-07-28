import { PollDto } from './poll-dto';

export interface PollListDto {
  data: PollDto[];
  nextCursor?: string;
}
