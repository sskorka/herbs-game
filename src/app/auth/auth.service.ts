import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { catchError, tap, concatMap, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { User } from './user.model';
import { Router } from '@angular/router';

export interface NameData {
  name: string
}

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);

  // to store the timeout object
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(_email: string, _name: string, _password: string) {
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
        console.log("res in switchMap:", res);
        return this.registerName(res.localId, _name);
      }),
      tap((nameRes: NameData) => this.assignNameToUser(nameRes.name))
    );
  }

  registerName(_uid: string, _name: string): Observable<any> {
    return this.http.put<NameData>(
      environment.db.names + _uid + '.json',
      {
        name: _name
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  login(_email: string, _password: string) {
    let returnedName: string = "";

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
        return this.fetchName(res.localId);
      }),
      tap((nameRes: NameData) => this.assignNameToUser(nameRes.name))
    );
  }

  fetchName(_uid: string): Observable<NameData> {
    return this.http.get<NameData>(
      environment.db.names + _uid + '.json'
    ).pipe(
      catchError(this.handleError)
    );
  }

  assignNameToUser(_name: string): void {
    const userData: User = JSON.parse(localStorage.getItem('userData'));
    userData.name = _name;
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/home']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
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

  autoLogout(expirationTime: number) {
    this.tokenExpirationTimer = setTimeout(
      () => this.logout(),
      expirationTime);
  }

  private handleAuthentication(uid: string, email: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(uid, email, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(err: HttpErrorResponse) {
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
