import { Component, OnInit, DoCheck } from '@angular/core';
import { Card } from '../shared/card/card.model';
import { GameManagerService, GameState, CurrentAction, GameConstants } from './game-manager.service';
import { Pot, PotName } from '../shared/pot/pot.model';

@Component({
  selector: 'app-singleplayer',
  templateUrl: './singleplayer.component.html',
  styleUrls: ['./singleplayer.component.css']
})
export class SingleplayerComponent implements OnInit, DoCheck {

  gameState: GameState;
  gameActions = CurrentAction;

  // used to show a warning when community garden reaches its limit
  communityGardenInDanger: boolean = false;
  communityGardenAboutToDie: boolean = false;

  anyGardenChoosable: boolean = false; // helper property
  gardensChoosable: { community : boolean, private : boolean, discard : boolean } = {
    community : false,
    private : false,
    discard : false
  }

  plantSequence = new Set();

  // inject the gameManager for communication with the game logic
  constructor(private gameMgr: GameManagerService) { }

  ngOnInit(): void {
    this.gameState = this.gameMgr.startGame();
    console.log('state looks as follows:', this.gameState);
  }

  ngDoCheck(): void {
    this.anyGardenChoosable = this.gardensChoosable.community || this.gardensChoosable.private || this.gardensChoosable.discard;
  }

  onLogGameState() {
    console.log('GameState:', this.gameState);
    console.log('anyGardenChoosable:', this.anyGardenChoosable);
    console.log('gardensChoosable:', this.gardensChoosable);
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

    // if the card is a Pot, make sure that only one pot can be selected
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
    if (this.gameState.currentAction != this.gameActions.PlantAction || this.anyGardenChoosable) {
      return;
    }

    if (!this.plantSequence.size) {
      // if no choices have been made yet, mark all gardens as choosable
      this.gardensChoosable.community = true;
      this.gardensChoosable.private = true;
      this.gardensChoosable.discard = true;
    } else {
      // determine which gardens should be marked as choosable
      this.gardensChoosable.community = !this.plantSequence.has("c");
      this.gardensChoosable.private = !this.plantSequence.has("p");
      this.gardensChoosable.discard = !this.plantSequence.has("d");
    }
  }

  // when player chooses one of the three gardens to plant the herb
  onGardenClick(event: Event) {

    // react only if necessary
    if(!this.anyGardenChoosable) {
      return;
    }

    // depending on the place clicked, the id might come from a different property
    const id = (<HTMLElement>event.target).id || (<HTMLElement>(<HTMLElement>event.target).offsetParent).offsetParent.id;

    switch(id) {
      case "community-garden":
        if(this.plantSequence.has("c")) {
          return; // no repeats sir
        }
        this.plantSequence.add("c");
        this.gameState.communityGarden.push(this.gameState.deck.shift());
        break;
      case "private-garden":
        if(this.plantSequence.has("p")) {
          return;
        }
        this.plantSequence.add("p");
        this.gameState.privateGarden.push(this.gameState.deck.shift());
        break;
      case "discard-pile":
        if(this.plantSequence.has("d")) {
          return;
        }
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

    this.gardensChoosable.community = false;
    this.gardensChoosable.private = false;
    this.gardensChoosable.discard = false;

    // if community garden is available AND it has 4 herbs, show a warning
    // this gets reverted after pot action
    if (this.gameState.communityGarden.length == GameConstants.COMMUNITY_GARDEN_MAX_HERBS - 1) {
      this.communityGardenInDanger = true;
    }

    // if community garden reaches its limit, it will die when player ends turn
    if (this.gameState.communityGarden.length == GameConstants.COMMUNITY_GARDEN_MAX_HERBS) {
      this.communityGardenAboutToDie = true;
    }

    // if community garden died, revert flags
    if (this.gameState.communityGarden.length < GameConstants.COMMUNITY_GARDEN_MAX_HERBS) {
      this.communityGardenAboutToDie = false;
      if (!this.gameState.communityGarden.length) {
        this.communityGardenInDanger = false;
      }
    }
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

    // if community garden is no longer in danger, revert the flag
    if (this.gameState.communityGarden.length < GameConstants.COMMUNITY_GARDEN_MAX_HERBS - 1) {
      this.communityGardenInDanger = false;
    }

    // if community garden died, revert the flag
    if (this.gameState.communityGarden.length < GameConstants.COMMUNITY_GARDEN_MAX_HERBS) {
      this.communityGardenAboutToDie = false;
    }
  }

  onHandleError() {
    this.gameState.error = null;
  }

  onConfirmGameOver() {
    this.gameState.score = null;
  }

  generateGameOverMsg(): string {
    return `You scored ${this.gameState.score.points} points!\n${this.gameState.score.message}\n\nYour rank: ${this.gameState.score.rank}`;
  }

}
