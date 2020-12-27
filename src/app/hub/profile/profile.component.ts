import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userData'))
    // this.user = this.authService.user.next(null);
    console.log("LOADED PROFILE:");
    console.log(this.user);
  }

}
