import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  appTitle = environment.APP_NAME;

  constructor(private authService: AuthService) { }

  onPlay() {
    this.authService.playNowEvent.emit();
  }
}
