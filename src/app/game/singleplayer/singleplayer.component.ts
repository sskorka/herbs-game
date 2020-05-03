import { Component, OnInit } from '@angular/core';
import { Card } from '../shared/card/card.model';
import { GameManagerService, GameState } from './game-manager.service';

@Component({
  selector: 'app-singleplayer',
  templateUrl: './singleplayer.component.html',
  styleUrls: ['./singleplayer.component.css']
})
export class SingleplayerComponent implements OnInit {

  gameState: GameState;

  constructor(private gameMgr: GameManagerService) { }

  ngOnInit(): void {
    this.gameMgr.startGame();
    this.gameState = this.gameMgr.getGameState();
    console.log('state looks as follows:', this.gameState);
    console.log('potting...');

  }

  onLogGameState() {
    console.log('GameState:', this.gameState);
  }

  onPot() {

  }

  onPlant() {

  }

}
