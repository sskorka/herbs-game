import { Injectable } from '@angular/core';
import { Card } from './card';
import { CARDS } from '../../models/constants/cards';
import { CardType } from '../../models/card-type';
import { SpecialCardType } from '../../models/special-card-type';

/**
 * Creates cards based on their specified model
 */
@Injectable()
export class CardFactory {
  /**
   * Creates cards of basic type
   */
  public getCard(cardType: CardType): Card {
    switch(cardType) {
      case CardType.Bay:
        return new Card(CARDS.BAY);
      case CardType.Dill:
        return new Card(CARDS.DILL);
      case CardType.Tarragon:
        return new Card(CARDS.TARRAGON);
      case CardType.Saffron:
        return new Card(CARDS.SAFFRON);
      case CardType.Lavender:
        return new Card(CARDS.LAVENDER);
      case CardType.Rosemary:
        return new Card(CARDS.ROSEMARY);
      case CardType.Sage:
        return new Card(CARDS.SAGE);
      default:
        return new Card(CARDS.PLACEHOLDER);
    }
  }

  /**
   * Creates cards worth points
   */
  public getSpecialCard(cardType: SpecialCardType): Card {
    switch(cardType) {
      case SpecialCardType.Mint:
        return new Card(CARDS.MINT);
      case SpecialCardType.Chive:
        return new Card(CARDS.CHIVE);
      case SpecialCardType.Thyme:
        return new Card(CARDS.THYME);
      default:
        return new Card(CARDS.PLACEHOLDER);
    }
  }
}