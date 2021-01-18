import { Ranks } from "./ranks";

export interface GameScore {
  points: number,
  rank: Ranks,
  nextRankPoints: number,
  messageLeft: string,
  messageRight: string
}
