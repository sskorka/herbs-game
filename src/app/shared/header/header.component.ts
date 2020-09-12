import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faSignInAlt, faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faSignInAlt = faSignInAlt;
  faCaretDown = faCaretDown;

  @Output() loginEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  openLogin() {
    this.loginEvent.emit();
  }

}
