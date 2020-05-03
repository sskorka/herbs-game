import { Component, OnInit } from '@angular/core';
import { Card } from '../card/card.model';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {
  private deck: Card[] = [];

  constructor() {}

  ngOnInit(): void {

  }

}
