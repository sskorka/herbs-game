import { Component, OnInit, Input } from '@angular/core';
import { Card } from './card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() card: Card = new Card("placeholder", "", false, 0);  // if left undefined, will cause errors
  @Input() isDeck = false;
  @Input() isInPot = false;

  deckPath = "/../../../../assets/images/cards/backs/back-c.png"

  constructor() { }

  ngOnInit(): void {
  }
}
