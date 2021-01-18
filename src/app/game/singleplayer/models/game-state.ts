import { Card } from "../../shared/card/card.model";
import { Pot } from "../../shared/pot/pot.model";
import { CurrentAction } from "./current-action";
import { GameScore } from "./game-score";

export interface GameState {
  deck: Card[],
  communityGarden: Card[],
  privateGarden: Card[],
  discardPile: Card[],
  pots: Pot[],
  currentAction: CurrentAction,
  cookieAwarded: boolean,
  score: GameScore,
  error: string
}
