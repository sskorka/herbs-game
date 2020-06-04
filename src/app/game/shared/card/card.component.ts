import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Card } from './card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnChanges {
  deckPath = "/../../../../assets/images/cards/backs/back-c.png"
  readonly deckEmptyPath = "/../../../../assets/images/cards/backs/deck-empty.png"
  readonly placeholderCard: Card = new Card("placeholder", "", false, 0);

  @Input() card: Card = this.placeholderCard;  // if left undefined, will cause errors
  @Input() isDeck = false;
  @Input() isInPot = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (!this.card) {
      this.card = this.placeholderCard;
      this.deckPath = this.deckEmptyPath;
    }
  }
}
