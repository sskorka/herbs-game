import { Statistics } from "src/app/game/singleplayer/models/statistics";

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
    const isTokenExpired = !this._tokenExpirationDate || new Date() > this._tokenExpirationDate;
    return isTokenExpired ? null : this._token;
  }
}
