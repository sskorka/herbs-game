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

  gardensChoosable: boolean = false;
  plantSequence = new Set();

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

  // POT PHASE:
  // only 1 pot can be selected at a time
  // any combination of herbs from community and private gardens can be selected (no check req)
  //
  // PLANT PHASE:
  // check onDeckClick()
  onCardClick(card: Card | Pot) {

    // don't select if not in pot phase
    if (this.gameState.currentAction != this.gameActions.PotAction) {
      return;
    }

    if (card instanceof Pot) {
      const isSelected = card.isSelected;
      this.gameState.pots.forEach(p => p.isSelected = false);
      card.isSelected = isSelected;
    }

    card.isSelected = !card.isSelected;
  }

  // if plantSequence is empty, show the card and wait for player's choice of garden
  // if plantSequence is 2 characters long, the sequence can autofinish and then endAction()
  onDeckClick() {
    // unclickable if not plant action or garden selection
    if (this.gameState.currentAction != this.gameActions.PlantAction || this.gardensChoosable) {
      return;
    }

    this.gardensChoosable = true;
  }

  // when player chooses one of the three gardens to plant the herb
  onGardenClick(event: Event) {
    // react only if necessary
    if(!this.gardensChoosable) {
      return;
    }

    const id = (<HTMLElement>event.target).id || (<HTMLElement>(<HTMLElement>event.target).offsetParent.lastChild).id;

    switch(id) {
      case "community-garden":
        this.plantSequence.add("c");
        this.gameState.communityGarden.push(this.gameState.deck.shift());
        break;
      case "private-garden":
        this.plantSequence.add("p");
        this.gameState.privateGarden.push(this.gameState.deck.shift());
        break;
      case "discard-pile":
        this.plantSequence.add("d");
        this.gameState.discardPile.push(this.gameState.deck.shift());
        break;
      default:
        console.log("id does not match!");
        return;
    }

    if(this.plantSequence.size >= 2) {
      // union the plantSequence so that the third choice is made automatically
      this.plantSequence = new Set([...this.plantSequence, ..."cpd"]);

      // convert from Set to string and then
      // send the sequence over to the gameMgr
      this.gameState = this.gameMgr.finishAction(Array.from(this.plantSequence).join(''));
      this.plantSequence = new Set();
    }

    this.gardensChoosable = false;
  }

  onPot() {
    this.gameState = this.gameMgr.finishAction(this.gameActions.PotAction)
  }

  onPlant() {
    this.gameState = this.gameMgr.finishAction(this.gameActions.PlantAction)
  }

  // this gets called only on user click, so only due to the pot phase being finished or skipped
  // NOT after plant phase
  onEndAction() {
    let comm: Card[] = this.gameState.communityGarden.filter(h => h.isSelected);
    let priv: Card[] = this.gameState.privateGarden.filter(h => h.isSelected);
    let pot: Pot = this.gameState.pots.find(p => p.isSelected);
    let potName: PotName = pot ? <PotName>pot.potName : null;

    // deselect the cards
    comm.forEach(h => h.isSelected = false);
    priv.forEach(h => h.isSelected = false);
    if (pot) {
      pot.isSelected = false;
    }

    // submit
    this.gameState = this.gameMgr.finishAction( {comm: comm, priv: priv, pot: potName} );
  }

  onHandleError() {
    this.gameState.error = null;
  }

}
