import { Card } from '../shared/card/card.model';
import { Pot, PotName } from '../shared/pot/pot.model';

export class GameConstants {
  public static readonly COMMUNITY_GARDEN_MAX_HERBS = 5;
}

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
  cookieAwarded: boolean,
  error: string
}

export class GameManagerService {

  private deck: Card[] = [];
  private discardedHalf: Card[] = [];

  private communityGarden: Card[] = [];
  private privateGarden: Card[] = [];
  private discardPile: Card[] = [];

  private pots: Pot[] = [];

  private cookieAwarded: boolean = false;

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

    return !(this.communityGarden.length >= GameConstants.COMMUNITY_GARDEN_MAX_HERBS);
  }

  // sorts herbs in the provided pot (by name, alphabetically; in GlassJar, by points)
  sortHerbs(pot: Pot): void {
    if (pot.potName === PotName.GlassJar) {
      pot.herbs.sort((a, b) => a.points > b.points ? 1 : -1);
    } else {
      pot.herbs.sort((a, b) => a.herbName > b.herbName ? 1 : -1);
    }
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

      // if the garden reaches its limit, discard all cards
      if (this.communityGarden.length == GameConstants.COMMUNITY_GARDEN_MAX_HERBS) {
        const commLength = this.communityGarden.length; // this assignment is MANDATORY!
        for (let i = 0; i < commLength; i++) {
          this.place(PlaceIn.DiscardPile, this.communityGarden.splice(0, 1));
        }
      }

      this.currentAction = CurrentAction.NewTurn;
      return this.getGameState();
    } // if POT
    else {
      // TODO check if the collection matches the real game state
      // this will be especially mandatory in the multiplayer version

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

        // if not, check if there are special herbs in the selection
        // those are only allowed in the Glass Jar
        if([...arg.comm, ...arg.priv].find(h => h.isSpecial) && !(pot.potName == PotName.GlassJar)) {
          return this.getGameState("You can't plant special herbs here!");
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

        // if all three special herbs are planted, award the bun
        // we can search by the name, or better, by their points
        const glassJar = this.pots.find(p => p.potName === PotName.GlassJar);
        if ((glassJar.herbs.find(h => h.points === 1) !== undefined)
          && (glassJar.herbs.find(h => h.points === 2) !== undefined)
          && (glassJar.herbs.find(h => h.points === 3) !== undefined)) {
            this.cookieAwarded = true;
          }

        // sort the herbs in the pot (especially useful in case of small pots)
        this.sortHerbs(pot);
      }

      // switch to the mandatory plant action
      // if deck is empty - NewTurn state until no more actions are possible
      this.currentAction = (this.deck.length) ? CurrentAction.PlantAction : CurrentAction.NewTurn;

      // if no more actions are possible - END THE GAME
      if (!this.deck.length && this.noMoreMoves()) {
        this.endGame();
      }

      return this.getGameState();
    }
  }

  getDeck(): Card[] {
    return this.deck.slice();
  }

  // returns true if there are no more possible actions
  noMoreMoves(): boolean {
    /* there are no more possible actions for the player if the following conditions are true:
     * 1. If there's at least one herb in the Large Pot, there must be no other herbs of the same kind in any garden
     * 2. If there's no herbs in the Large Pot, there must be NO herbs in any garden
     * 3. If there's at least one herb in the Wooden Planter, the gardens must be either:
     *    a) empty
     *    b) their herbs must be no different than the pot's
     * 4. If there's no herbs in the Wooden Planter, there must be NO herbs in any garden
     * 5. There must be no new pairs for the Small Pots
     * 6. If there's less than 3 plants in the Glass Jar, there must be no herbs in any garden
    */

    const gardensWithSpecials = [...this.privateGarden, ...this.communityGarden];
    const gardens = gardensWithSpecials.filter(h => !h.isSpecial);

    // ---1---
    const largePot = this.pots.find(p => p.potName === PotName.LargePot);

    if (largePot.herbs.length) {  // don't want no undefined errors >:[
      if (gardens.find(h => h.herbName === largePot.herbs[0].herbName) !== undefined) {
        return false;
      }
    }

    // ---2---
    if (!largePot.herbs.length && gardens.length) {
      return false;
    }

    // ---3---
    const woodenPlanter = this.pots.find(p => p.potName === PotName.WoodenPlanter);

    if (woodenPlanter.herbs.length && gardens.length) {
      // there must be at least one herb in the garden that isn't in the planter
      for(let i = 0; i < gardens.length; i++) {
        // is gardens[i] in the pot? if not, return false
        if (woodenPlanter.herbs.find(h => h.herbName === gardens[i].herbName) === undefined) {
          return false;
        }
      }
    }

    // ---4---
    if (!woodenPlanter.herbs.length && gardens.length) {
      return false;
    }

    // ---5---
    // thanks to Set we won't be checking duplicates
    const gardensSet: Set<string> = new Set<string>(gardens.map(h => h.herbName));

    for(let i = 0; i < gardensSet.size; i++) {
      const currentName: string = gardensSet.values().next().value;
      // how many occurrences of a given herb in gardens
      let occurrences: number = gardens.reduce((occurrences, herb) => {
        if (herb.herbName == currentName) {
          return occurrences + 1;
        } else {
          return occurrences;
        }
      }, 0);

      // if there's at least a pair, check if it's in the pot
      // if not, return false
      if (occurrences >= 2) {
        const herb = this.pots.find(p => p.potName === PotName.SmallPots).herbs.find(h => h.herbName === currentName);
        if (herb === undefined) {
          return false;
        }
      }
    }

    // ---6---
    const glassJar = this.pots.find(p => p.potName === PotName.GlassJar);

    if (glassJar.herbs.length < 3 && gardensWithSpecials.length) {
      return false;
    }

    // if all of the above fail, there's no more moves
    return true;
  }

  calculatePoints(): number {
    // first get points from the pots
    let total = this.pots.reduce((totalPoints, pot) => {
      return totalPoints + pot.getScore();
    }, 0)

    // each herb in the private garden is worth 1 point
    total += this.privateGarden.length;

    // add 5 points if the cookie has been awarded
    total += (this.cookieAwarded) ? 5 : 0;

    return total;
  }

  endGame(): void {
    // calculate points
    const points = this.calculatePoints();
    console.log(`GAME OVER!!! You scored ${points} points!`);
  }

  getGameState(error?: string): GameState {
    return {
      deck: this.deck.slice(),
      communityGarden: this.communityGarden.slice(),
      privateGarden: this.privateGarden.slice(),
      discardPile: this.discardPile.slice(),
      pots: this.pots.slice(),
      currentAction: this.currentAction,
      cookieAwarded: this.cookieAwarded,
      error: error
    };
  }
}
