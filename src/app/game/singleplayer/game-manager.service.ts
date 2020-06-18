import { Card } from '../shared/card/card.model';
import { Pot, PotName } from '../shared/pot/pot.model';

const COMMUNITY_GARDEN_MAX_HERBS = 5;

export enum PlaceIn {
  CommunityGarden,
  PrivateGarden,
  DiscardPile,
}

export enum CurrentAction {
  NewTurn,
  PotAction,
  PlantAction
}

export interface GameState {
  deck: Card[],
  communityGarden: Card[],
  privateGarden: Card[],
  discardPile: Card[],
  pots: Pot[],
  currentAction: CurrentAction,
  error: string
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

  startGame(): GameState {
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

    // this.plant(PotName.LargePot, this.deck.splice(0,1));
    // this.plant(PotName.LargePot, this.deck.splice(0,1));
    // this.plant(PotName.LargePot, this.deck.splice(0,1));

    // And the first turn begins!
    this.currentAction = CurrentAction.NewTurn;
    return this.getGameState();
  }

  private generateDeck() {
    // A deck consists of 72 cards: 63 herbs and 9 special herbs
    // There are 7 different herbs (9 of each) and 3 special herbs (3 of each)

    for(let i = 0; i < 9; i++) {
      this.deck.push(Card.generateBay());
      this.deck.push(Card.generateDill());
      this.deck.push(Card.generateTarragon());
      this.deck.push(Card.generateSaffron());
      this.deck.push(Card.generateLavender());
      this.deck.push(Card.generateRosemary());
      this.deck.push(Card.generateSage());

      if (!(i % 3)) {
        this.deck.push(Card.generateMint());
        this.deck.push(Card.generateChive());
        this.deck.push(Card.generateThyme());
      }
    }
  }

  private generatePots(): void {
    this.pots.push(Pot.generateLarge());
    this.pots.push(Pot.generateWooden());
    this.pots.push(Pot.generateSmall());
    this.pots.push(Pot.generateGlass());
  }

  private discardHalf(): void {
    // in this variant of the game we need to remove 36 cards from the deck at random
    // we can store those cards for later, if the player wants to continue

    this.discardedHalf = this.deck.splice(0, Math.trunc(this.deck.length / 2));
  }

  private shuffleDeck(): void {
    // shuffle the deck using Durstenfeld's algorithm
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  // returns true if there's no pot overflow
  plant(pot: PotName, herbs: Card[]): boolean {
    let matchingPot: Pot = this.pots.find(p => p.potName == pot)

    if ((matchingPot.herbs.length + herbs.length) > matchingPot.maxHerbs) {
      return false;
    }

    matchingPot.herbs.push(...herbs);
    return true;
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

  // sorts herbs in the provided pot (by name, alphabetically)
  sortHerbs(pot: Pot): void {
    pot.herbs.sort((a, b) => a.herbName > b.herbName ? 1 : -1);
  }

  /*
   * Finishing the action might go three ways:
   * 1. If switching from NEW TURN, pass CurrentAction depending which action you want to switch to
   * 2. If ENDING a POT TURN, pass the object containing the selected collection of herbs and the target pot
   * 3. If ENDING a PLANT TURN, pass the string with the order of picked pots
   *       ie. "pcd" means the 1st card from the deck goes to private garden, 2nd to community, 3rd to discard pile
   *           this way only 3 bytes get sent over network when playing the multiplayer variant
   * Returns new game state
   */
  finishAction(
    arg: | CurrentAction
         | { comm: Card[], priv: Card[], pot: PotName }
         | string
  ): GameState {

    // if NEW TURN
    if(typeof arg === "number") {
      switch(arg) {
        case CurrentAction.PlantAction:
          this.currentAction = CurrentAction.PlantAction;
          break;
        case CurrentAction.PotAction:
          this.currentAction = CurrentAction.PotAction;
          break;
      }

      return this.getGameState();
    } // if PLANT
    else if(typeof arg === "string") {
      if(arg.length != 3) {
        return this.getGameState(`finishAction(arg): arg is string and is not 3 characters long!\narg: ${arg}`);
      }

      let order = [...arg];

      while(order.length >= 1) {
        switch(order.shift()) {
          case 'c':
            this.place(PlaceIn.CommunityGarden, this.deck.splice(0, 1));
            break;
          case 'p':
            this.place(PlaceIn.PrivateGarden, this.deck.splice(0, 1));
            break;
          case 'd':
            this.place(PlaceIn.DiscardPile, this.deck.splice(0, 1));
            break;
        }
      }

      this.currentAction = CurrentAction.NewTurn;
      return this.getGameState();
    } // if POT
    else {
      // { comm: Card[], priv: Card[], pot: PotName }
      // check if the collection matches the real game state
      // this will be especially mandatory in the multiplayer version
      // TO DO
      // if (arg.comm.length > 0)
      //   if (arg.comm.every(h => this.communityGarden.includes(h)))

      // check if cards have been selected without a pot (error)
      if ((arg.comm.length > 0 || arg.priv.length > 0) && !arg.pot) {
        return this.getGameState("Select the pot to plant your herbs in.");
      }

      // check if user wants to skip pot action
      if (arg.comm.length == 0 && arg.priv.length == 0 && !arg.pot) {
        // skip straight to the plant action.
        // empty block so the if statement is clear on its purpose
      } else {
        // if cards and pot are selected,
        // check if there's not going to be any overflow before planting
        let pot: Pot = this.pots.find(p => p.potName == arg.pot);
        if((arg.comm.length + arg.priv.length + pot.herbs.length) > pot.maxHerbs) {
          return this.getGameState("Maximum number of herbs reached!");
        }

        // if not, check if the selection matches pot's requirements
        if(!pot.herbsValid([...arg.comm, ...arg.priv], pot.herbs)) {
          return this.getGameState("Your selection does not match pot's requirements!");
        }

        // if not, plant from both arrays
        while (arg.comm.length) {
          let herbIndex = this.communityGarden.indexOf(arg.comm.pop());
          this.plant(arg.pot, this.communityGarden.splice(herbIndex, 1));
        }
        while (arg.priv.length) {
          let herbIndex = this.privateGarden.indexOf(arg.priv.pop());
          this.plant(arg.pot, this.privateGarden.splice(herbIndex, 1));
        }

        // sort the herbs in the pot (especially useful in case of small pots)
        this.sortHerbs(pot);
      }

      // switch to the mandatory plant action
      this.currentAction = CurrentAction.PlantAction;
      return this.getGameState();
    }
  }

  getDeck(): Card[] {
    return this.deck.slice();
  }

  getGameState(error?: string): GameState {
    return {
      deck: this.deck.slice(),
      communityGarden: this.communityGarden.slice(),
      privateGarden: this.privateGarden.slice(),
      discardPile: this.discardPile.slice(),
      pots: this.pots.slice(),
      currentAction: this.currentAction,
      error: error
    };
  }
}
