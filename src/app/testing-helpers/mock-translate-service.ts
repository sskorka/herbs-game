import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';

export class MockTranslateService {
  public onLangChange = new EventEmitter();
  public onTranslationChange = new EventEmitter();
  public onDefaultLangChange = new EventEmitter();
  public get = (key: string) => of(key);
  public instant = (key: string) => key;
}
