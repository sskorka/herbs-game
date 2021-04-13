import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthResponseData } from './models/auth-response-data';
import { ExtraData } from './models/extra-data';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isInRegisterMode: boolean = false;
  isLoading: boolean = false;
  error: string = null;

  @Output() onCloseEvent = new EventEmitter<void>();

  // prevent body scroll when modal is open
  @HostListener('wheel', ['$event'])
  handleWheelEvent(event) {
    event.preventDefault();
  }

  constructor(private authService: AuthService,
              private router: Router,
              private translate: TranslateService) { }

  onSubmit(form: NgForm): void {
    if(!form.valid) {
      return;
    }

    const { email, name, password } = form.value;

    let authObservable: Observable<AuthResponseData|ExtraData>;

    this.isLoading = true;
    this.error = null;

    if(!this.isInRegisterMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signup(email, name, password);
    }

    authObservable.subscribe(
      response => {
          this.onClose();
          this.isLoading = false;
          this.router.navigate(['/hub']);
        },
        errMessage => {
          console.log(errMessage);
          this.error = errMessage;
          this.isLoading = false;
        }
      );
  }

  onToggleRegistration(): void {
    this.isInRegisterMode = !this.isInRegisterMode;
    this.error = null;
  }

  onClose(): void {
    this.onCloseEvent.emit();
  }

  /**
    * For some reason, Firebase returns a buggy "too many attempts" response from its API.
    * As a temporary solution, check if the response simply contains the error code.
   */
  getTranslation(err: string): string {
    if (err.includes('TOO_MANY_ATTEMPTS_TRY_LATER'))
      return this.translate.instant('Auth.Errors.TooManyAttemptsTryLater');

    switch(err) {
      case 'EMAIL_EXISTS':
        return this.translate.instant('Auth.Errors.EmailExists');
      case 'EMAIL_NOT_FOUND':
        return this.translate.instant('Auth.Errors.EmailNotFound');
      case 'INVALID_PASSWORD':
        return this.translate.instant('Auth.Errors.InvalidPassword');
      case 'OPERATION_NOT_ALLOWED':
        return this.translate.instant('Auth.Errors.OperationNotAllowed');
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        return this.translate.instant('Auth.Errors.TooManyAttemptsTryLater');
      case 'USER_DISABLED':
        return this.translate.instant('Auth.Errors.UserDisabled');
      default:
        return err;
    }
  }
}
