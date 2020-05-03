import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../card/card.model';

@Component({
  selector: 'app-pot',
  templateUrl: './pot.component.html',
  styleUrls: ['./pot.component.css']
})
export class PotComponent implements OnInit {
  @Input() card: Card;

  constructor() { }

  ngOnInit(): void {
  }

}
