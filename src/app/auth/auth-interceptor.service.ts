import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpParams } from '@angular/common/http';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from './models/user';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => this.authenticate(user, req, next))
    );
  }

  private authenticate(user: User, req: HttpRequest<any>, next: HttpHandler) {
    if (!user) {
      return next.handle(req);
    }

    const authReq = req.clone(
      {
        params: new HttpParams().set('auth', user.token)
      }
    );
    return next.handle(authReq);
  }
}
