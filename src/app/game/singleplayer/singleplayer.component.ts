import { Component, OnInit, DoCheck, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Card } from '../shared/card/card.model';
import { GameManagerService } from './game-manager.service';
import { Pot, PotName } from '../shared/pot/pot.model';
import { GameState } from './models/game-state';
import { CurrentAction } from './models/current-action';
import { GameConstants } from './models/game-constants';

@Component({
  selector: 'app-singleplayer',
  templateUrl: './singleplayer.component.html',
  styleUrls: ['./singleplayer.component.css']
})
export class SingleplayerComponent implements OnInit, DoCheck, AfterViewChecked {
  @ViewChild('info') information: ElementRef;

  gameState: GameState;
  gameActions = CurrentAction;

  communityGardenInDanger: boolean = false;
  communityGardenAboutToDie: boolean = false;

  anyGardenChoosable: boolean = false;
  gardensChoosable: { community : boolean, private : boolean, discard : boolean } = {
    community : false,
    private : false,
    discard : false
  }

  plantSequence = new Set();

  /**
   * Inject the gameManager for communication with the game logic
   */
  constructor(private gameMgr: GameManagerService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.gameState = this.gameMgr.startGame();
  }

  ngDoCheck(): void {
    this.anyGardenChoosable = this.gardensChoosable.community || this.gardensChoosable.private || this.gardensChoosable.discard;
  }

  ngAfterViewChecked(): void {
    let newInformation: string;

    if(this.gameState.currentAction == this.gameActions.NewTurn)
      newInformation = this.translate.instant('Game.SP.Info.NewTurn');
    else if(this.gameState.currentAction == this.gameActions.PotAction)
      newInformation = this.translate.instant('Game.SP.Info.PotAction');
    else if(this.gameState.currentAction == this.gameActions.PlantAction && !this.anyGardenChoosable)
      newInformation = this.translate.instant('Game.SP.Info.DrawCard');
    else if(this.anyGardenChoosable)
      newInformation = this.translate.instant('Game.SP.Info.Plant');

    this.information.nativeElement.innerHTML = newInformation;
  }

  /**
   * POT PHASE:
   * only 1 pot can be selected at a time
   * any combination of herbs from community and private gardens can be selected (no check req)
   *
   * PLANT PHASE:
   * check onDeckClick()
   */
  onCardClick(card: Card | Pot): void {
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

  /**
   * If plantSequence is empty, show the card and wait for player's choice of garden
   * If plantSequence is 2 characters long, the sequence can autofinish and then endAction()
   */
  onDeckClick(): void {
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

  onGardenClick(event: Event): void {
    // react only if necessary
    if(!this.anyGardenChoosable) {
      return;
    }

    // depending on the place clicked, the id might come from a different property
    const id = (<HTMLElement>event.target).id || (<HTMLElement>(<HTMLElement>event.target).offsetParent).offsetParent.id;

    switch(id) {
      case "community-garden":
        if(this.plantSequence.has("c")) {
          return; // no repeats
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

    // There are PLANTABLES_COUNT = 3 for the player to choose, after choosing PLANTABLES_COUNT-1,
    // we can deduce the last garden to use
    if(this.plantSequence.size >= GameConstants.PLANTABLES_COUNT - 1) {
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

  onPot(): void {
    this.gameState = this.gameMgr.finishAction(this.gameActions.PotAction)
  }

  onPlant(): void {
    this.gameState = this.gameMgr.finishAction(this.gameActions.PlantAction)
  }

  /**
   * This gets called only on user click, so only due to the pot phase being finished or skipped
   * NOT after plant phase
   */
  onEndAction(): void {
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
    const isCommunityGardenNoLongerInDanger = this.gameState.communityGarden.length < GameConstants.COMMUNITY_GARDEN_MAX_HERBS - 1;
    if (isCommunityGardenNoLongerInDanger) {
      this.communityGardenInDanger = false;
    }

    // if community garden died, revert the flag
    const isCommunityGardenDead = this.gameState.communityGarden.length < GameConstants.COMMUNITY_GARDEN_MAX_HERBS;
    if (isCommunityGardenDead) {
      this.communityGardenAboutToDie = false;
    }
  }

  onHandleError(): void {
    this.gameState.error = null;
  }
}
