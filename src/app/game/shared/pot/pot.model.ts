import { Card } from '../card/card.model';

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
  private static _graphicsPath = '/../../../../assets/images/cards/faces/pots/';

  constructor(
    public potName: string,
    public maxHerbs: number,
    public iconUrl: string,
    public graphicsUrl: string,
    public herbs: Card[],
    public scoreTable: any,
    public herbsValid: HerbVerificationFunction
  ) {}

  public getScore(): number {
    let total: number = 0;
    if (!this.herbs.length) {
      return 0;
    }

    switch(this.potName) {
      case PotName.LargePot:
        return this.scoreTable[this.herbs.length];
      case PotName.WoodenPlanter:
        return this.herbs.length <= 1 ? 0 : this.scoreTable[this.herbs.length];
      case PotName.SmallPots:
        return this.scoreTable[this.herbs.length / 2];
      case PotName.GlassJar:
        const glassJarPoints = this.herbs.reduce((sum, herb) => sum + herb.points, 0);
        return this.scoreTable[this.herbs.length] + glassJarPoints;
    }
  }

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
        const areSelectedEqual: boolean = sel.every(h => h.herbName === sel[0].herbName);
        return !currHerbs.length ? areSelectedEqual : (areSelectedEqual && sel[0].herbName === currHerbs[0].herbName);
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
        // it's a Set of herb names, since some Card objects - seemingly the same - might actually differ from each other
        const setFromSelection = new Set<string>(sel.map((h => h.herbName)));

        // if the pot is empty, check if selection is made of unique herbs
        if(currHerbs.length == 0 && sel.length === setFromSelection.size) {
          return true;
        }

        // if the pot isn't empty, check if the pot and the selection combined result in an unchanged Set
        let combinedSet = new Set<string>([...sel.map(h=>h.herbName), ...currHerbs.map(h=>h.herbName)]);
        return currHerbs.length > 0 && sel.length + currHerbs.length === combinedSet.size;
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
      // this pot may only store unique pairs of herbs
      (sel: Card[], currHerbs: Card[]): boolean => {
        if (sel.length % 2 !== 0) {
          return false;
        }

        // combine selection with pot's herbs and check if all pairs are unique
        const allHerbs: Card[] = [...sel, ...currHerbs];
        let herbsToDiscard: Card[] = allHerbs.slice();

        allHerbs.forEach(h => {
          const currentName: string = h.herbName;
          // if there's exactly 2 herbs of a given herb, delete them from herbsToDiscard
          // repeat until herbsToDiscard is empty
          const occurrences: number = allHerbs.reduce((occurrences, herb) => herb.herbName === currentName ? occurrences + 1 : occurrences, 0);

          if (occurrences === 2) {
            herbsToDiscard = herbsToDiscard.filter(h => h.herbName !== currentName);
          } else {
            return false;  // return early as there is no point in further checking
          }
        })

        return !herbsToDiscard.length;
      }
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
      // this pot may store any kind of herb, and it's the only one that can store special herbs
      // since the max herb number check is done in the manager, there's nothing really to check in here
      // so we can return true for any collection of herbs
      (sel: Card[], currHerbs: Card[]): boolean => {
        return true;
      }
    )
  }
}
