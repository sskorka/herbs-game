import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Card } from '../card/card.model';
import { Pot, PotName } from './pot.model';

@Component({
  selector: 'app-pot',
  templateUrl: './pot.component.html',
  styleUrls: ['./pot.component.css']
})
export class PotComponent implements OnInit {
  @Input() pot: Pot;
  @Input() i: number; // holds the iterator of the structure generating pots; used for styling pot's name

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
  }

  getTranslation(src: string): string {
    switch(src)
    {
      case PotName.LargePot.toUpperCase():
        return this.translate.instant('Game.Shared.Models.Pots.LargePot').toUpperCase();
      case PotName.SmallPots.toUpperCase():
        return this.translate.instant('Game.Shared.Models.Pots.SmallPots').toUpperCase();
      case PotName.WoodenPlanter.toUpperCase():
        return this.translate.instant('Game.Shared.Models.Pots.WoodenPlanter').toUpperCase();
      case PotName.GlassJar.toUpperCase():
        return this.translate.instant('Game.Shared.Models.Pots.GlassJar').toUpperCase();
      default:
        return src;
    }
  }

}
