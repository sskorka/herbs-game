import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData, ExtraData } from './auth.service';

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
          console.log("auth.component observable response:", response);
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

  onToggleRegistration() {
    this.isInRegisterMode = !this.isInRegisterMode;
  }

  onHandleError() {
    this.error = null;
  }

  onClose() {
    this.onCloseEvent.emit();
  }
}
