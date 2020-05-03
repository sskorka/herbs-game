import { Card } from '../shared/card/card.model';
import { Pot, PotName } from '../shared/pot/pot.model';

const COMMUNITY_GARDEN_MAX_HERBS = 5;

export enum PlaceIn {
  CommunityGarden,
  PrivateGarden,
  DiscardPile,
}

export enum CurrentAction {
  PotAction,
  PlantAction
}

export interface GameState {
  deck: Card[],
  communityGarden: Card[],
  privateGarden: Card[],
  discardPile: Card[],
  pots: Pot[],
  currentAction: CurrentAction
}

export class GameManagerService {

  private deck: Card[] = [];
  private discardedHalf: Card[] = [];

  private communityGarden: Card[] = [];
  private privateGarden: Card[] = [];
  private discardPile: Card[] = [];

  private pots: Pot[] = [];

  private currentAction: CurrentAction;

  constructor() {}

  startGame() {
    this.generateDeck();
    this.generatePots();
    this.shuffleDeck();
    this.discardHalf();
    // From this point, the deck is ready to be served

    // First two cards from the deck should go to the community garden
    // Then three cards to the private garden
    // ...and then one card to the discard pile
    this.place(PlaceIn.CommunityGarden, this.deck.splice(0, 2));
    this.place(PlaceIn.PrivateGarden, this.deck.splice(0, 3));
    this.place(PlaceIn.DiscardPile, this.deck.splice(0, 1));

    // And the first turn begins!
  }

  generateDeck() {
    // A deck consists of 72 cards: 63 herbs and 9 special herbs
    // There are 7 different herbs (9 of each) and 3 special herbs (3 of each)

    for(let i = 0; i < 9; i++) {
      this.deck.push(Card.genBay());
      this.deck.push(Card.genDill());
      this.deck.push(Card.genTarragon());
      this.deck.push(Card.genSaffron());
      this.deck.push(Card.genLavender());
      this.deck.push(Card.genRosemary());
      this.deck.push(Card.genSage());

      if (!(i % 3)) {
        this.deck.push(Card.genMint());
        this.deck.push(Card.genChive());
        this.deck.push(Card.genThyme());
      }
    }
  }

  generatePots(): void {
    this.pots.push(Pot.genLarge());
    this.pots.push(Pot.genWooden());
    this.pots.push(Pot.genSmall());
    this.pots.push(Pot.genGlass());
  }

  discardHalf(): void {
    // in this variant of the game we need to remove 36 cards from the deck at random
    // we can store those cards for later, if the player wants to continue

    this.discardedHalf = this.deck.splice(0, Math.trunc(this.deck.length / 2));
  }

  shuffleDeck(): void {
    // shuffle the deck using Durstenfeld's algorithm
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  plant(pot: PotName, herbs: Card[]): void {
    this.pots.find(p => p.potName == pot).herbs.push(...herbs);
  }

  // returns true if there's no garden overflow
  // 'in' is taken by JavaScript, thus '_in'
  place(_in: PlaceIn, herbs: Card[]): boolean {
    switch(_in) {
      case PlaceIn.CommunityGarden:
        this.communityGarden.push(...herbs);
        break;
      case PlaceIn.PrivateGarden:
        this.privateGarden.push(...herbs);
        break;
      case PlaceIn.DiscardPile:
        this.discardPile.push(...herbs);
        break;
    }

    return !(this.communityGarden.length >= COMMUNITY_GARDEN_MAX_HERBS);
  }

  getDeck(): Card[] {
    return this.deck.slice();
  }

  getGameState(): GameState {
    return {
      deck: this.deck.slice(),
      communityGarden: this.communityGarden.slice(),
      privateGarden: this.privateGarden.slice(),
      discardPile: this.discardPile.slice(),
      pots: this.pots.slice(),
      currentAction: this.currentAction
    };
  }
}
