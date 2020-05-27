import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Card } from '../shared/card/card.model';
import { GameManagerService, GameState, CurrentAction } from './game-manager.service';
import { Pot, PotName } from '../shared/pot/pot.model';

@Component({
  selector: 'app-singleplayer',
  templateUrl: './singleplayer.component.html',
  styleUrls: ['./singleplayer.component.css']
})
export class SingleplayerComponent implements OnInit, AfterContentInit {

  gameState: GameState;
  gameActions = CurrentAction;

  constructor(private gameMgr: GameManagerService) { }

  ngOnInit(): void {
    this.gameState = this.gameMgr.startGame();
    console.log('state looks as follows:', this.gameState);
  }

  ngAfterContentInit(): void {
    // this.gameMgr.finishAction();
  }

  onLogGameState() {
    console.log('GameState:', this.gameState);
  }

  // only 1 pot can be selected at a time
  // any combination of herbs from community and private gardens can be selected (no check req)
  onCardClick(card: Card | Pot) {
    if (card instanceof Pot) {
      const isSelected = card.isSelected;
      this.gameState.pots.forEach(p => p.isSelected = false);
      card.isSelected = isSelected;
    }

    card.isSelected = !card.isSelected;
  }

  onPot() {
    this.gameState = this.gameMgr.finishAction(this.gameActions.PotAction)
  }

  onPlant() {
    this.gameState = this.gameMgr.finishAction(this.gameActions.PlantAction)
  }

  onEndAction() {
    let comm: Card[] = this.gameState.communityGarden.filter(h => h.isSelected);
    let priv: Card[] = this.gameState.privateGarden.filter(h => h.isSelected);
    let pot: Pot = this.gameState.pots.find(p => p.isSelected);
    let potName: PotName = <PotName>pot.potName;

    comm.forEach(h => h.isSelected = false);
    priv.forEach(h => h.isSelected = false);
    pot.isSelected = false;

    this.gameState = this.gameMgr.finishAction( {comm: comm, priv: priv, pot: potName} );
    // if(this.gameState.error) {
    //   window.alert(this.gameState.error);
    // }
  }

  onHandleError() {
    this.gameState.error = null;
  }

}
