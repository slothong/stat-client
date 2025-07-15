export interface Option {
  id: string;
  optionText: string;
  votedByMe?: boolean;
  voteCount?: number;
}

// export class Option {
//   readonly id: string;
//   readonly optionText: string;
//   readonly votes: number;
//   readonly votedByMe: boolean;

//   constructor({
//     id,
//     optionText,
//     votes,
//     votedByMe,
//   }: {
//     id: string;
//     optionText: string;
//     votes: number;
//     votedByMe?: boolean;
//   }) {
//     this.id = id;
//     this.optionText = optionText;
//     this.votes = votes;
//     this.votedByMe = !!votedByMe;
//   }

//   static fromDto(dto: OptionDto) {
//     return new Option({
//       id: dto.id,
//       optionText: dto.optionText,
//       votes: dto.votes,
//       votedByMe: dto.votedByMe,
//     });
//   }
// }
