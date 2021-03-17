import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from './../environments/environment';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  /** true if login modal should be opened */
  isAuthOn: boolean = false;
  /** user login status */
  isAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService) {
      translate.addLangs(['en', 'pl']);
      translate.setDefaultLang(environment.defaultLanguage);
      translate.use('en');
    }

  ngOnInit() {
    this.authService.autoLogin();
    this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
    this.authService.playNowEvent.subscribe(() => this.handleAuthentication());
  }

  ngOnDestroy(): void {
    this.authService.playNowEvent.unsubscribe();
  }

  openLogin() {
    this.isAuthOn = true;
  }

  closeLogin() {
    this.isAuthOn = false;
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  private handleAuthentication(): void {
    if(this.isAuthenticated) {
      this.router.navigate(['/hub']);
    } else {
      this.openLogin();
    }
  }
}
