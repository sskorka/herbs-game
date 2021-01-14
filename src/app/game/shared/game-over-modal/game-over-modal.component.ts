import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GameScore, Ranks } from '../../singleplayer/game-manager.service';

@Component({
  selector: 'app-game-over-modal',
  templateUrl: './game-over-modal.component.html',
  styleUrls: ['./game-over-modal.component.css']
})
export class GameOverModalComponent implements OnInit {
  @Input() score: GameScore;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
  }

  getTranslation(rank: Ranks): string {
    switch(rank) {
      case Ranks.Rank6:
        return this.translate.instant('Game.SP.Ranks.Rank6');
      case Ranks.Rank5:
        return this.translate.instant('Game.SP.Ranks.Rank5');
      case Ranks.Rank4:
        return this.translate.instant('Game.SP.Ranks.Rank4');
      case Ranks.Rank3:
        return this.translate.instant('Game.SP.Ranks.Rank3');
      case Ranks.Rank2:
        return this.translate.instant('Game.SP.Ranks.Rank2');
      case Ranks.Rank1:
        return this.translate.instant('Game.SP.Ranks.Rank1');
    }
  }
}
