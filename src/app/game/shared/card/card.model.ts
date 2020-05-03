export class Card {
  constructor(
    public herbName: string,
    public iconUrl: string,
    public graphicsUrl: string,
    public isSpecial: boolean,
    public points: number
  ) {}

  private static _graphicsPath = '/../../../../assets/images/cards/faces/';

  // public static gen
  public static genBay(): Card {
    return new Card(
      'Bay',
      '',
      this._graphicsPath + 'bay.png',
      false,
      0
    );
  }

  public static genDill(): Card {
    return new Card(
      'Dill',
      '',
      this._graphicsPath + 'dill.png',
      false,
      0
    )
  }

  public static genTarragon(): Card {
    return new Card(
      'Tarragon',
      '',
      this._graphicsPath + 'tarragon.png',
      false,
      0
    )
  }

  public static genSaffron(): Card {
    return new Card(
      'Saffron',
      '',
      this._graphicsPath + 'saffron.png',
      false,
      0
    )
  }

  public static genLavender(): Card {
    return new Card(
      'Lavender',
      '',
      this._graphicsPath + 'lavender.png',
      false,
      0
    )
  }

  public static genRosemary(): Card {
    return new Card(
      'Rosemary',
      '',
      this._graphicsPath + 'rosemary.png',
      false,
      0
    )
  }

  public static genSage(): Card {
    return new Card(
      'Sage',
      '',
      this._graphicsPath + 'sage.png',
      false,
      0
    )
  }

  public static genMint(): Card {
    return new Card(
      'Mint',
      '',
      this._graphicsPath + 'mint.png',
      true,
      1
    )
  }

  public static genChive(): Card {
    return new Card(
      'Chive',
      '',
      this._graphicsPath + 'chive.png',
      true,
      2
    )
  }

  public static genThyme(): Card {
    return new Card(
      'Thyme',
      '',
      this._graphicsPath + 'thyme.png',
      true,
      3
    )
  }
}
