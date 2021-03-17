import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { catchError, tap, concatMap, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './models/user';
import { AuthResponseData } from './models/auth-response-data';
import { ExtraData } from './models/extra-data';
import { Statistics } from '../game/singleplayer/models/statistics';

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);

  playNowEvent = new EventEmitter<boolean>();

  // to store the timeout object
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, name: string, password: string): Observable<any> {
    const user = { email, password, returnRescureToken: true };
    const url = environment.firebase.endpoints.signup + environment.firebase.apiKey;

    return this.http.post<AuthResponseData>(url, user).pipe(
      catchError(err => this.handleError(err)),
      tap(res => this.handleAuthentication(res.localId, res.email, res.idToken, +res.expiresIn)),
      concatMap((res: AuthResponseData) => {
        return this.registerExtraData(res.localId, name);
      }),
      tap((extraDataRes: ExtraData) => this.assignExtraDataToUser(extraDataRes))
    );
  }

  registerExtraData(uid: string, name: string): Observable<any> {
    const extraData = {
      name,
      stats:
      {
        topScore: 0,
        gamesPlayed: 0,
        herbsLost: 0,
        perfectScores: 0
      }
    };
    const url = environment.firebase.db.extraData + uid + '.json';

    return this.http.put<ExtraData>(url, extraData).pipe(
        catchError(err => this.handleError(err))
      );
  }

  updateExtraData(uid: string, name: string, stats: Statistics): Observable<any> {
    const extraData = { name, stats };
    const url = environment.firebase.db.extraData + uid + '.json';

    return this.http.put<ExtraData>(url, extraData).pipe(
      catchError(err => this.handleError(err)),
      mergeMap(() => {
        return this.fetchExtraData(uid);
      }),
      tap((extraData: ExtraData) => this.assignExtraDataToUser(extraData))
    );
  }

  login(email: string, password: string): Observable<any> {
    const user = { email, password, returnSecureToken: true };
    const url = environment.firebase.endpoints.signin + environment.firebase.apiKey;

    return this.http.post<AuthResponseData>(url, user).pipe(
      catchError(err => this.handleError(err)),
      tap((res: AuthResponseData) => {
          this.handleAuthentication(res.localId, res.email, res.idToken, +res.expiresIn);
      }),
      mergeMap((res: AuthResponseData) => this.fetchExtraData(res.localId)),
      tap((extraDataRes: ExtraData) => this.assignExtraDataToUser(extraDataRes))
      );
  }

  private assignExtraDataToUser(extraData: ExtraData): void {
    const userData: User = JSON.parse(localStorage.getItem('userData'));
    userData.name = extraData.name;
    userData.stats = extraData.stats;
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  private fetchExtraData(uid: string): Observable<ExtraData> {
    const url = environment.firebase.db.extraData + uid + '.json';

    return this.http.get<ExtraData>(url).pipe(
        catchError(err => this.handleError(err))
      );
  }

  logout(): void {
    this.user.next(null);
    this.router.navigate(['/home']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  /**
   * Auto login user by using localStorage data and set a new auto logout date.
   */
  autoLogin(): void {
    const userData: {
      id: string,
      email: string,
      _token: string,
      _tokenExpirationDate: string,
      name: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    // Create a User object, so that it can validate the token
    const user = new User(
      userData.id,
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    // And if the token is still valid, emit this user and calculate the new autoLogout time
    if(user.token) {
      this.user.next(user);
      const newTokenExpirationTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();

      this.autoLogout(newTokenExpirationTime);
    }
  }

  private autoLogout(expirationTime: number): void {
    this.tokenExpirationTimer = setTimeout(
      () => this.logout(),
      expirationTime);
  }

  private handleAuthentication(uid: string, email: string, token: string, expiresIn: number): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(uid, email, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    // TODO: log the error object on the server
    let errMessage = 'A mysterious error occurred! Try again and please remind the developer to implement a better error handling system. Thanks.';

    if(!err.error || !err.error.error) {
      return throwError(errMessage);
    }

    switch (err.error.error.message) {
      case 'EMAIL_EXISTS':
        errMessage = 'This e-mail address has already been taken!';
        break;
      case 'EMAIL_NOT_FOUND':
        errMessage = 'E-mail address not found!';
        break;
      case 'INVALID_PASSWORD':
        errMessage = "Incorrect password!";
        break;
      case 'OPERATION_NOT_ALLOWED':
        errMessage = "Password sign-in is disabled for this project.";
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errMessage = "We have blocked all requests from this device due to unusual activity. Try again later.";
        break;
      case 'USER_DISABLED':
        errMessage = "The user account has been disabled by an administrator.";
        break;
    }

    return throwError(errMessage);
  }

}
