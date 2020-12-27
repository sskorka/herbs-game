import { Statistics } from '../game/singleplayer/game-manager.service';

export class User {
  public name: string;
  public stats: Statistics;

  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }

    return this._token;
  }
}
