import { Component, Input } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Card } from './card';
import { CARDS } from '../../models/constants/cards';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  deckPath = "/../../../../assets/images/cards/backs/back-c.png"
  readonly deckEmptyPath = "/../../../../assets/images/cards/backs/deck-empty.png"
  readonly placeholderCard: Card = new Card(CARDS.PLACEHOLDER);

  private _card: Card;
  private language: string = environment.defaultLanguage;

  @Input() set card(card: Card) {
    if(!card) {
      this._card = this.placeholderCard;
      this.deckPath = this.deckEmptyPath;
    } else {
      this._card = card;
    }
  }
  get card(): Card {
    return this._card;
  }

  @Input() isDeck = false;
  @Input() isInPot = false;

  public get imageUrl(): string {
    return `url(${this.card.getImagePath(this.language)})`;
  }

  constructor(private translate: TranslateService) {
    this.language = translate.currentLang;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => this.language = event.lang)
  }
}
