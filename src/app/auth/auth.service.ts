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

  signup(_email: string, _name: string, _password: string): Observable<any> {
    return this.http.post<AuthResponseData>(
      environment.endpoints.signup + environment.API_KEY,
      {
        email: _email,
        password: _password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(res => {
        this.handleAuthentication(res.localId, res.email, res.idToken, +res.expiresIn);
      }),
      concatMap((res: AuthResponseData) => {
        return this.registerExtraData(res.localId, _name);
      }),
      tap((extraDataRes: ExtraData) => this.assignExtraDataToUser(extraDataRes))
    );
  }

  registerExtraData(_uid: string, _name: string): Observable<any> {
    return this.http.put<ExtraData>(
      environment.db.extraData + _uid + '.json',
      {
        name: _name,
        stats:
        {
          topScore: 0,
          gamesPlayed: 0,
          herbsLost: 0,
          perfectScores: 0
        }
      }
      ).pipe(
        catchError(this.handleError)
      );
  }

  updateExtraData(_uid: string, _name: string, _stats: Statistics): Observable<any> {
    return this.http.put<ExtraData>(
      environment.db.extraData + _uid + '.json',
      {
        name: _name,
        stats: _stats
      }
    ).pipe(
      catchError(this.handleError),
      mergeMap(() => {
        return this.fetchExtraData(_uid);
      }),
      tap((extraData: ExtraData) => this.assignExtraDataToUser(extraData))
    );
  }

  login(_email: string, _password: string): Observable<any> {
    return this.http.post<AuthResponseData>(
      environment.endpoints.signin + environment.API_KEY,
      {
        email: _email,
        password: _password,
        returnSecureToken: true
      }
      ).pipe(
      catchError(this.handleError),
      tap((res: AuthResponseData) => {
          this.handleAuthentication(res.localId, res.email, res.idToken, +res.expiresIn);
      }),
      mergeMap((res: AuthResponseData) => {
        return this.fetchExtraData(res.localId);
      }),
      tap((extraDataRes: ExtraData) => this.assignExtraDataToUser(extraDataRes))
      );
  }

  assignExtraDataToUser(extraData: ExtraData): void {
    const userData: User = JSON.parse(localStorage.getItem('userData'));
    userData.name = extraData.name;
    userData.stats = extraData.stats;
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  fetchExtraData(_uid: string): Observable<ExtraData> {
    return this.http.get<ExtraData>(
      environment.db.extraData + _uid + '.json'
      ).pipe(
        catchError(this.handleError)
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

  autoLogin(): void {
    // If data in localstorage exist, convert to object
    const userData: {
      id: string,
      email: string,
      _token: string,
      _tokenExpirationDate: string,
      name: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    // Create a User object, so that it can validate the token
    const userObject = new User(
      userData.id,
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    // And if the token is still valid, emit this user and calculate the new autoLogout time
    if(userObject.token) {
      this.user.next(userObject);
      const newTokenExpirationTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();

      this.autoLogout(newTokenExpirationTime);
    }
  }

  autoLogout(expirationTime: number): void {
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
