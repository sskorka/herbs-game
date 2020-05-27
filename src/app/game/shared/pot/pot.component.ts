import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../card/card.model';
import { Pot } from './pot.model';

@Component({
  selector: 'app-pot',
  templateUrl: './pot.component.html',
  styleUrls: ['./pot.component.css']
})
export class PotComponent implements OnInit {
  @Input() pot: Pot;

  constructor() { }

  ngOnInit(): void {
  }

}
