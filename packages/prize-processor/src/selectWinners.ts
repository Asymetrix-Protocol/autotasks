import { Draw, ParticipantsInfo } from "./types";

export function selectWinners(draw: Draw, participantsInfo: ParticipantsInfo): string[] {
  let winners: Array<string> = new Array();

  for (let i: number = 0; i < draw.randomness.length; ++i) {
    winners.push(participantsInfo.participants.at(draw.randomness[i].toNumber() - 1));
  }

  console.log(`Winners: ${winners}.`);

  return winners;
}
