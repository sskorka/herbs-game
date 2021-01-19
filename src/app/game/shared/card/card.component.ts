import { Component, Input } from '@angular/core';
import { Card } from './card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  deckPath = "/../../../../assets/images/cards/backs/back-c.png"
  readonly deckEmptyPath = "/../../../../assets/images/cards/backs/deck-empty.png"
  readonly placeholderCard: Card = new Card("placeholder", "", false, 0);

  private _card: Card;
  @Input() set card(card: Card) {
    if(!card) {
      this._card = this.placeholderCard;
      this.deckPath = this.deckEmptyPath;
    } else {
      this._card = card;
    }
  }
  get card(): Card {
    return this._card;
  }
  @Input() isDeck = false;
  @Input() isInPot = false;
}
