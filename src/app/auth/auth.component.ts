import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthResponseData } from './models/auth-response-data';
import { ExtraData } from './models/extra-data';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isInRegisterMode: boolean = false;
  isLoading: boolean = false;
  error: string = null;

  @Output() onCloseEvent = new EventEmitter<void>();

  // prevent body scroll when modal is open
  @HostListener('wheel', ['$event'])
  handleWheelEvent(event) {
    event.preventDefault();
  }

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm): void {
    if(!form.valid) {
      return;
    }

    const email = form.value.email;
    const name = form.value.name;
    const password = form.value.password;

    let authObservable: Observable<AuthResponseData|ExtraData>;

    this.isLoading = true;

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
  }

  onHandleError(): void {
    this.error = null;
  }

  onClose(): void {
    this.onCloseEvent.emit();
  }
}
