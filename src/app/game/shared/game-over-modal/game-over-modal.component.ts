import { Component, Input, OnInit } from '@angular/core';
import { GameScore } from '../../singleplayer/game-manager.service';

@Component({
  selector: 'app-game-over-modal',
  templateUrl: './game-over-modal.component.html',
  styleUrls: ['./game-over-modal.component.css']
})
export class GameOverModalComponent implements OnInit {
  @Input() score: GameScore;

  constructor() { }

  ngOnInit(): void {
  }

}
