import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm): void {
    if(!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    //let loginObservable: Observable<AuthResponseData>;

    this.authService.login(email, password)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/hub']);
        },
        errMessage => {
          console.log(errMessage);
        }
      );

    form.reset();
  }
}
