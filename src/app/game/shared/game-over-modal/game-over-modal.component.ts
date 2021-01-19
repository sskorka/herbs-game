import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GameScore } from '../../singleplayer/models/game-score';
import { Ranks } from '../../singleplayer/models/ranks';

@Component({
  selector: 'app-game-over-modal',
  templateUrl: './game-over-modal.component.html',
  styleUrls: ['./game-over-modal.component.css']
})
export class GameOverModalComponent {
  @Input() score: GameScore;

  constructor(private translate: TranslateService) { }

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
