import { Component, OnInit } from '@angular/core';
import { Card } from '../card/card';

@Component({
  selector: 'app-deck',
  template: ''
})
export class DeckComponent implements OnInit {
  private deck: Card[] = [];

  constructor() {}

  ngOnInit(): void {

  }

}
