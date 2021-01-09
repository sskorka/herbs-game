import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Toaster } from 'ngx-toast-notifications';
import { User } from 'src/app/auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = null;

  constructor(private authService: AuthService,
    private toaster: Toaster,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userData'))
    // this.user = this.authService.user.next(null);
    console.log("LOADED PROFILE:");
    console.log(this.user);
  }

  onViewChart(): void {
    this.toaster.open(this.translate.instant("ComingSoon"));
  }
}
