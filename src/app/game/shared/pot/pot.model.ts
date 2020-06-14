import { Card } from '../card/card.model';

interface ScoreTable {
  numberOfCards: number,
  score: number
}

// names must be consistent in both gameManager and model, thus the use of enum
export enum PotName {
  LargePot = "Large Pot",
  SmallPots = "Small Pots",
  WoodenPlanter = "Wooden Planter",
  GlassJar = "Glass Jar"
}

// each Pot contains its own function to which you pass user's selection and pot's own herbs
// this function then returns a boolean informing whether or not the selection is correct
type HerbVerificationFunction = (selection: Card[], currentlyPlacedHerbs: Card[]) => boolean;

export class Pot {
  public isSelected: boolean = false;

  constructor(
    public potName: string,
    public maxHerbs: number,
    public iconUrl: string,
    public graphicsUrl: string,
    public herbs: Card[],
    public scoreTable: any,
    public herbsValid: HerbVerificationFunction
  ) {}

  public getScore(pot: Pot) {
    if (pot.herbs.length > pot.maxHerbs) {
      // throw error of some kind
    }
  }

  private static _graphicsPath = '/../../../../assets/images/cards/faces/pots/';

  public static generateLarge() {
    return new Pot(
      PotName.LargePot,
      7,
      '',
      this._graphicsPath + 'large-pot.png',
      [],
      {
        1: 2,
        2: 6,
        3: 10,
        4: 14,
        5: 18,
        6: 20,
        7: 22
      },
      // this pot may only store herbs of the same kind. Provide selected herbs and currently planted herbs to run checks.
      (sel: Card[], currHerbs: Card[]): boolean => {
        if(!currHerbs.length) {
          return (sel.every(h => h.herbName === sel[0].herbName));
        }
        return sel.every(h => h.herbName === sel[0].herbName) && sel[0].herbName === currHerbs[0].herbName
      }
    )
  }

  public static generateWooden() {
    return new Pot(
      PotName.WoodenPlanter,
      7,
      '',
      this._graphicsPath + 'wooden-planter.png',
      [],
      {
        2: 3,
        3: 4,
        4: 6,
        5: 8,
        6: 12,
        7: 14
      },
      // this pot may only store herbs that are distinct from each other
      (sel: Card[], currHerbs: Card[]): boolean => {
        // create a Set so that only unique herbs are stored
        // a Set of strings, as seemingly same Card objects might not actually be the same
        let setFromSelection: Set<string> = new Set<string>(sel.map((h => h.herbName)));

        // if the pot is empty, check if selection is made of unique herbs
        if(currHerbs.length == 0 && sel.length === setFromSelection.size) {
          return true;
        }

        // if the pot isn't empty, check if the pot and the selection combined result in an unchanged Set
        let combinedSet = new Set<string>([...sel.map(h=>h.herbName), ...currHerbs.map(h=>h.herbName)]);
        if(currHerbs.length > 0 && sel.length + currHerbs.length === combinedSet.size) {
          return true;
        }

        return false;
      }
    )
  }

  public static generateSmall() {
    return new Pot(
      PotName.SmallPots,
      12,
      '',
      this._graphicsPath + 'small-pots.png',
      [],
      {
        1: 4,
        2: 8,
        3: 12,
        4: 14,
        5: 16,
        6: 18
      },
      (sel: Card[], currHerbs: Card[]): boolean => { return true;}
    )
  }

  public static generateGlass() {
    return new Pot(
      PotName.GlassJar,
      3,
      '',
      this._graphicsPath + 'glass-jar.png',
      [],
      {
        1: 2,
        2: 4,
        3: 6
      },
      (sel: Card[], currHerbs: Card[]): boolean => { return true;}
    )
  }
}
