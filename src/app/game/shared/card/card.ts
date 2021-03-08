import { CardModel } from '../../models/card-model';

export class Card {
  public isSelected = false;
  public herbName: string;
  public graphicsUrl: string;
  public isSpecial: boolean;
  public points: number;

  constructor(card: CardModel) {
    this.herbName = card.herbName;
    this.graphicsUrl = card.graphicsUrl;
    this.isSpecial = card.isSpecial;
    this.points = card.points;
  }

  public getImagePath(language: string): string {
    const BASE_URL = '../../../../assets/images/cards/faces/';
    return `${BASE_URL}${language}/${this.graphicsUrl}`;
  }
}