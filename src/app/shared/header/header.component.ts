import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { faSignInAlt, faSignOutAlt, faCaretDown, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  faSignInAlt = faSignInAlt;
  faSignOutAlt = faSignOutAlt;
  faCaretDown = faCaretDown;
  faGamepad = faGamepad;

  isAuthenticated = false;
  private userSub: Subscription;

  @Output() loginEvent = new EventEmitter<void>();
  @Output() langChanged = new EventEmitter<string>();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  openLogin() {
    this.loginEvent.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  changeLang(lang: string) {
    this.langChanged.emit(lang);
  }

}
