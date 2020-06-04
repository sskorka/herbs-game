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

export class Pot {
  public isSelected: boolean = false;

  constructor(
    public potName: string,
    public maxHerbs: number,
    public iconUrl: string,
    public graphicsUrl: string,
    public herbs: Card[],
    public scoreTable: any
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
      }
    )
  }
}
